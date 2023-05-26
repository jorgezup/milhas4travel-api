import checkIfFlightIsInDb from './checkIfFlightIsInDb'
import isItStillValid from './isStillValid'
import { setBodyRequest } from './setBodyRequest'
import queue from '../queue'
import { BodyRequestInterface } from '../interfaces/flightDataInterface'

const processSearchRequest = async (
  departuresStations: string[],
  arrivalsStations: string[],
  datesArray: string[],
  searchId: string,
  sessionId: string,
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

  bodyRequests.forEach((bodyRequest) => {
    queue.add('AzulFlight', {
      bodyRequest,
      searchId,
      sessionId,
    })
  })
}

export default processSearchRequest
