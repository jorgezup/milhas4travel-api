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
import formatDataFromDb from '../shared/formatDataFromDb'

export async function azulRoutes(app: FastifyInstance) {
  app.post('/search', async (request, reply) => {
    try {
      const { departuresStations, arrivalsStations, dateStart, dateEnd } =
        request.body as AzulSearchRequest

      // const departureArray = Array.isArray(departure) ? departure : [departure]
      // const arrivalArray = Array.isArray(arrival) ? arrival : [arrival]

      const datesArray = dateEnd
        ? getDatesArray(dateStart, dateEnd)
        : [dateStart]

      const bodyRequests = []

      for (const departure of departuresStations) {
        for (const arrival of arrivalsStations) {
          for (const date of datesArray) {
            const bodyRequest = setBodyRequest(departure, arrival, date)
            bodyRequests.push(bodyRequest)
          }
        }
      }

      const searchId = randomUUID()

      const sessionId = getCookie(request, reply)

      bodyRequests.forEach((bodyRequest) => {
        queue.add('AzulFlight', {
          bodyRequest,
          searchId,
          sessionId,
        })
      })

      return reply.status(200).send({
        message:
          'In a few minutes you will be able to see the results in the search page.',
      })
    } catch (error) {
      // @ts-ignore
      return reply.status(500).send({ message: error.message })
    }
  })

  interface Request {
    arrivalStation: string
  }

  // create an route (GET /cheapest) the receive the arrival airport and return the 10 cheapest flights
  app.get('/cheapest', async (request, reply) => {
    try {
      const { arrivalStation } = request.query as Request

      const flights = await AzulFlight.find({
        arrivalStation,
      })
        .sort({ lowestPoints: 1 })
        .limit(10)

      const formattedData = formatDataFromDb(flights)

      return reply.status(200).send(formattedData)
    } catch (error) {
      // @ts-ignore
      return reply.status(500).send({ message: error.message })
    }
  })
}
