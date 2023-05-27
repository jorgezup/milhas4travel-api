import checkIfFlightIsInDb from './checkIfFlightIsInDb'
import isItStillValid from './isStillValid'
import { setBodyRequest } from './setBodyRequest'
import queue from '../queue'
import { BodyRequestInterface } from '../interfaces/flightDataInterface'
import { EventEmitter } from 'node:events'

const emitter = new EventEmitter()

emitter.setMaxListeners(0) // Disable max listeners

const processSearchRequest = async (
  departuresStations: string[],
  arrivalsStations: string[],
  datesArray: string[],
  searchId: string,
  sessionId: string,
  scheduler: boolean = false,
): Promise<void> => {
  const bodyRequests: BodyRequestInterface[] = []

  for (const departure of departuresStations) {
    for (const arrival of arrivalsStations) {
      for (const date of datesArray) {
        const flight = await checkIfFlightIsInDb(departure, arrival, date)

        if (!flight || !isItStillValid(flight)) {
          const bodyRequest: BodyRequestInterface = setBodyRequest(
            departure,
            arrival,
            date,
          )
          bodyRequests.push(bodyRequest)
        }
      }
    }
  }
  if (scheduler) {
    bodyRequests.forEach((bodyRequest) => {
      queue.add(
        'queue',
        {
          bodyRequest,
          searchId,
          sessionId,
        },
        {
          delay: 0, // Start immediately
          repeat: {
            every: 60 * 60 * 2 * 1000, // Repeat every 2 hours
            endDate: Date.now() + 7 * 24 * 60 * 60 * 1000, // Run for 7 days
          },
        },
      )
    })
  }

  bodyRequests.forEach((bodyRequest) => {
    queue.add('queue', {
      bodyRequest,
      searchId,
      sessionId,
    })
  })
}

export default processSearchRequest
