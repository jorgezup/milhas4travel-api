/* eslint-disable no-undef */
import { FastifyInstance } from 'fastify'
import { getDatesArray } from '../shared/getDatesArray'
import { AzulSearchRequest } from '../interfaces/flightDataInterface'
import AzulFlight from '../models/AzulFlightModel'
import formatDataFromDb from '../shared/formatDataFromDb'
import processSearchRequest from '../shared/processSearchRequest'
import { randomUUID } from 'crypto'
import { checkSessionIdExistsMiddleware } from '../middleware/check-session-id-exists'

export async function azulRoutes(app: FastifyInstance) {
  app.post(
    '/search',
    {
      preHandler: [checkSessionIdExistsMiddleware],
    },
    async (request, reply) => {
      try {
        const { departuresStations, arrivalsStations, dateStart, dateEnd } =
          request.body as AzulSearchRequest

        const sessionId = request.cookies.sessionId as string

        const datesArray = dateEnd
          ? getDatesArray(dateStart, dateEnd)
          : [dateStart]

        const searchId = randomUUID()
        // const sessionId = getCookie(request, reply)

        await processSearchRequest(
          departuresStations,
          arrivalsStations,
          datesArray,
          searchId,
          sessionId,
        )

        return reply.status(200).send({
          message:
            "In a few minutes you're gonna get an email with dates and prices.",
          searchId,
        })
      } catch (error) {
        // @ts-ignore
        return reply.status(500).send({ message: error.message })
      }
    },
  )

  app.post(
    '/schedule-flight-search',
    {
      preHandler: [checkSessionIdExistsMiddleware],
    },
    async (request, reply) => {
      try {
        const { departuresStations, arrivalsStations, dateStart, dateEnd } =
          request.body as AzulSearchRequest

        const sessionId = request.cookies.sessionId as string

        const datesArray = dateEnd
          ? getDatesArray(dateStart, dateEnd)
          : [dateStart]

        const searchId = randomUUID()

        await processSearchRequest(
          departuresStations,
          arrivalsStations,
          datesArray,
          searchId,
          sessionId,
          true,
        )

        return reply.status(200).send({
          message:
            'Every two hours during 7 days you are gonna get an email with dates and prices.',
        })
      } catch (error) {
        // @ts-ignore
        return reply.status(500).send({ message: error.message })
      }
    },
  )

  app.get(
    '/cheapest',
    {
      preHandler: [checkSessionIdExistsMiddleware],
    },
    async (request, reply) => {
      try {
        const { arrivalStation } = request.query as { arrivalStation: string }

        const sessionId = request.cookies.sessionId as string

        const flights = await AzulFlight.aggregate([
          { $match: { arrivalStation, sessionId } },
          { $sort: { lowestPoints: 1, departureDate: 1 } },
          { $group: { _id: '$departureDate', flight: { $first: '$$ROOT' } } },
          { $replaceRoot: { newRoot: '$flight' } },
          { $sort: { lowestPoints: 1 } },
          { $limit: 10 },
        ])

        const formattedData = formatDataFromDb(flights)

        return reply.status(200).send(formattedData)
      } catch (error) {
        // @ts-ignore
        return reply.status(500).send({ message: error.message })
      }
    },
  )

  app.get(
    '/search/:searchId',
    {
      preHandler: [checkSessionIdExistsMiddleware],
    },
    async (request, reply) => {
      try {
        const { searchId } = request.params as { searchId: string }

        const sessionId = request.cookies.sessionId as string

        const flights = await AzulFlight.find({
          searchId,
          sessionId,
        })

        const formattedData = formatDataFromDb(flights)

        return reply.status(200).send(formattedData)
      } catch (error) {
        // @ts-ignore
        return reply.status(500).send({ message: error.message })
      }
    },
  )

  // route my searches
  app.get(
    '/my-searches',
    {
      preHandler: [checkSessionIdExistsMiddleware],
    },
    async (request, reply) => {
      try {
        const sessionId = request.cookies.sessionId as string

        const flights = await AzulFlight.find({
          sessionId,
        })

        const formattedData = formatDataFromDb(flights)

        return reply.status(200).send(formattedData)
      } catch (error) {
        // @ts-ignore
        return reply.status(500).send({ message: error.message })
      }
    },
  )
}
