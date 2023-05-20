import moment from 'moment/moment'
import {
  FlightDataInterface,
  flightsInterface,
} from '../interfaces/flightDataInterface'

export async function getFlightData({ trips }: FlightDataInterface) {
  const travel = trips[0]
  const flights: flightsInterface[] = []
  const flightData = {
    qtdOfFlights: travel.journeys.length,
    flights,
  }

  const journeys = travel.journeys
  for (let i = 0; i < journeys.length; i++) {
    const journey = journeys[i]
    const fares = journey.fares[0]
    const paxPoints = fares.paxPoints[0]
    const levels = paxPoints.levels[0]

    const hours = journey.identifier.duration.hours
    // if duration.minutes < 10 add a 0 before the number and if duration.minutes === 0 add 00
    const minutes =
      journey.identifier.duration.minutes < 10
        ? `0${journey.identifier.duration.minutes}`
        : journey.identifier.duration.minutes === 0
        ? '00'
        : journey.identifier.duration.minutes
    const airportConnections: string[] = []

    const flight = {
      value: levels.points,
      connection: journey.identifier.connections?.count,

      duration: `${hours}:${minutes}`,
      airportConnections,
    }

    if (
      flight?.connection &&
      journey.identifier.connections?.stationsInformation !== undefined
    ) {
      const stationsInformation =
        journey.identifier.connections.stationsInformation

      for (
        let j = 0;
        // eslint-disable-next-line no-unmodified-loop-condition
        !stationsInformation || j < stationsInformation.length;
        j++
      ) {
        if (stationsInformation) {
          flight.airportConnections.push(stationsInformation[j].code)
        }
      }
    }

    flightData.flights.push(flight)
  }

  return {
    departureStation: travel.departureStation,
    arrivalStation: travel.arrivalStation,
    departureDate: moment(travel.std).format('DD/MM/YYYY'),
    lowestPoints: travel.fareInformation.lowestPoints,
    highestPoints: travel.fareInformation.highestPoints,
    searchDate: moment().format('DD/MM/YYYY HH:mm:ss'),
    flightData,
  }
}
