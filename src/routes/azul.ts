/* eslint-disable no-undef */
import { FastifyInstance } from 'fastify'
import { getBearerTokenAzul } from '../shared/getBearerTokenAzul'
import { getAzulFlights } from '../shared/getAzulFlights'
import { getFlightData } from '../shared/getFlightData'
import { getDatesArray } from '../shared/getDatesArray'
import { setBodyRequest } from '../shared/setBodyRequest'
import {
  AzulSearchRequest,
  FlightDataResponseInterface,
  AzulSearchRequestMultipleDates,
} from '../interfaces/flightDataInterface'

export async function azulRoutes(app: FastifyInstance) {
  app.post('/search', async (request) => {
    try {
      const { departure, arrival, date } = request.body as AzulSearchRequest

      const bodyRequest = setBodyRequest(departure, arrival, date)

      const bearerToken = await getBearerTokenAzul()

      const data = await getAzulFlights(bodyRequest, bearerToken)

      if (data === undefined || data.trips[0].flightType === null) {
        return { message: 'No flights found for this date.' }
      }

      return await getFlightData(data)
    } catch (error) {
      // @ts-ignore
      return { message: error.message }
    }
  })

  app.post('/search/multipleDates/register', async (request, reply) => {
    try {
      // @ts-ignore
      const { departure, arrival, dateStart, dateEnd } =
        request.body as AzulSearchRequestMultipleDates

      const datesArray = getDatesArray(dateStart, dateEnd)

      const response: FlightDataResponseInterface[] = []

      for (const date of datesArray) {
        const bodyRequest = setBodyRequest(departure, arrival, date)
        const bearerToken = await getBearerTokenAzul()
        const data = await getAzulFlights(bodyRequest, bearerToken)
        if (data === undefined || data.trips[0].flightType === null) {
          continue
        }
        response.push(await getFlightData(data))
        // store data in app.db
        // store cookie in app.db
      }
      // response {message: In a few minutes you will receive an email with the results.}
      return response
    } catch (error) {
      // @ts-ignore
      return { message: error.message }
    }
  })

  app.get('/search/multipleDates/results', async (request, reply) => {
    try {
      // get cookie from app.db
      // get data from app.db
      // return data
    } catch (error) {
      // @ts-ignore
      return { message: error.message }
    }
  })
}
