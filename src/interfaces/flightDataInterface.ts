export interface TravelDataInterface {
  identifier: {
    connections?: {
      count: number
      stationsInformation?: [
        {
          code: string
        },
      ]
    }
    duration: {
      hours: number
      minutes: number
    }
  }
  fares: [
    {
      paxPoints: [
        {
          levels: [
            {
              points: number
            },
          ]
        },
      ]
    },
  ]
}
export interface FlightDataInterface {
  trips: [
    {
      flightType: string | null
      departureStation: string
      arrivalStation: string
      std: string
      fareInformation: {
        lowestPoints: number
        highestPoints: number
      }
      journeys: TravelDataInterface[]
    },
  ]
}

export interface flightsInterface {
  value: number
  connection?: number
  duration: string
  airportConnections?: string[]
}

export interface FlightDataResponseInterface {
  departureStation: string
  arrivalStation: string
  departureDate: string
  lowestPoints: number
  highestPoints: number
  searchDate: string
  flightData: {
    qtdOfFlights: number
    flights: flightsInterface[]
  }
}

export interface AzulSearchRequest {
  departure: string
  arrival: string
  date: string
}

export interface AzulSearchRequestMultipleDates {
  departure: string
  arrival: string
  dateStart: string
  dateEnd: string
}
