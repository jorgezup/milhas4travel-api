/* eslint-disable no-undef */
import { FastifyInstance } from 'fastify'
import { getBearerTokenAzul } from '../shared/getBearerTokenAzul'
import { getAzulFlights } from '../shared/getAzulFlights'
import { getFlightData } from '../shared/getFlightData'
import { getDatesArray } from '../shared/getDatesArray'
import { setBodyRequest } from '../shared/setBodyRequest'
import {
  AzulSearchRequest,
  AzulSearchRequestMultipleDates,
} from '../interfaces/flightDataInterface'
import AzulFlight from '../models/AzulFlightModel'
import queue from '../queue'
import { randomUUID } from 'crypto'
import getCookie from '../shared/getCookie'
import hasFlightInDb from '../shared/hasFlightInDb'
import formatDataFromDb from '../shared/formatDataFromDb'

export async function azulRoutes(app: FastifyInstance) {
  app.post('/search', async (request, reply) => {
    try {
      const { departure, arrival, date } = request.body as AzulSearchRequest

      const flight = await AzulFlight.find({
        departureStation: departure.toUpperCase(),
        arrivalStation: arrival.toUpperCase(),
        departureDate: date,
      })
        .sort({ searchDate: -1 })
        .limit(1) // get the last search

      // if there is a flight in the database, check if it is still valid
      if (flight.length > 0) {
        const hasFlight = hasFlightInDb(flight[0])

        if (hasFlight) {
          return formatDataFromDb(flight) // return the flight from the database
        }
      }

      const bodyRequest = setBodyRequest(departure, arrival, date)

      const bearerToken = await getBearerTokenAzul()

      const response = await getAzulFlights(bodyRequest, bearerToken)

      if (response === undefined || response.trips[0].flightType === null) {
        return { message: 'No flights found for this date.' }
      }

      const searchId = randomUUID()

      const sessionId = getCookie(request, reply)

      const data = getFlightData(response)

      const options = {
        multipleDates: false,
        multipleDestinations: false,
        multipleOrigins: false,
      }

      const dataToSave = { ...data, searchId, sessionId, options }

      const flightToSave = new AzulFlight(dataToSave)

      await flightToSave.save()

      return { searchId, options, data }
    } catch (error) {
      // @ts-ignore
      return { message: error.message }
    }
  })

  app.post('/search/multipleDates/register', async (request, reply) => {
    try {
      const { departure, arrival, dateStart, dateEnd } =
        request.body as AzulSearchRequestMultipleDates

      const datesArray = getDatesArray(dateStart, dateEnd)

      const bearerToken = await getBearerTokenAzul()

      const searchId = randomUUID()

      const sessionId = getCookie(request, reply)

      for (const date of datesArray) {
        const bodyRequest = setBodyRequest(departure, arrival, date)

        await queue.add('AzulFlight', {
          bodyRequest,
          bearerToken,
          searchId,
          sessionId,
        })
      }

      return reply.status(200).send({
        message:
          'In a few minutes you will be able to see the results in the search page.',
      })
    } catch (error) {
      // @ts-ignore
      return reply.status(500).send({ message: error.message })
    }
  })

  app.get('/search/multipleDates/latest', async () => {
    try {
      const flights = await AzulFlight.find()
        .where('options.multipleDates')
        .equals(true)
        .sort({ createdAt: -1 })
        .limit(1)

      return { flights }
    } catch (error) {
      // @ts-ignore
      return { message: error.message }
    }
  })
}
