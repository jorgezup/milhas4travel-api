/* eslint-disable no-undef */
import { FastifyInstance } from 'fastify'
import { getDatesArray } from '../shared/getDatesArray'
import { AzulSearchRequest } from '../interfaces/flightDataInterface'
import AzulFlight from '../models/AzulFlightModel'
import { randomUUID } from 'crypto'
import getCookie from '../shared/getCookie'
import formatDataFromDb from '../shared/formatDataFromDb'
import processSearchRequest from '../shared/processSearchRequest'

export async function azulRoutes(app: FastifyInstance) {
  app.post('/search', async (request, reply) => {
    try {
      const { departuresStations, arrivalsStations, dateStart, dateEnd } =
        request.body as AzulSearchRequest

      const datesArray = dateEnd
        ? getDatesArray(dateStart, dateEnd)
        : [dateStart]

      const searchId = randomUUID()
      const sessionId = getCookie(request, reply)

      await processSearchRequest(
        departuresStations,
        arrivalsStations,
        datesArray,
        searchId,
        sessionId,
      )

      return reply.status(200).send({
        message:
          'In a few minutes you will be able to see the results in the search page.',
      })
    } catch (error) {
      // @ts-ignore
      return reply.status(500).send({ message: error.message })
    }
  })

  app.get('/cheapest', async (request, reply) => {
    try {
      const { arrivalStation } = request.query as { arrivalStation: string }

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
  // get flights by searchId
  app.get('/search/:searchId', async (request, reply) => {
    try {
      const { searchId } = request.params as { searchId: string }

      const flights = await AzulFlight.find({
        searchId,
      })

      const formattedData = formatDataFromDb(flights)

      return reply.status(200).send(formattedData)
    } catch (error) {
      // @ts-ignore
      return reply.status(500).send({ message: error.message })
    }
  })
}
