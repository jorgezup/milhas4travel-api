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

export interface FlightsInterface {
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
    flights: FlightsInterface[]
  }
}

export interface FlightInDb extends FlightDataResponseInterface {
  searchId?: string
}

export interface AzulSearchRequest {
  departuresStations: [string]
  arrivalsStations: [string]
  dateStart: string
  dateEnd?: string
}

export interface CriteriaInterface {
  departureStation: string
  arrivalStation: string
  std: string
  departureDate: string
}

export interface PassengerInterface {
  type: string
  count: string
  companionPass: string
}

export interface FlexibleDaysInterface {
  daysToLeft: string
  daysToRight: string
}

export interface BodyRequestInterface {
  criteria: CriteriaInterface[]
  passengers: PassengerInterface[]
  flexibleDays: FlexibleDaysInterface
  currencyCode: string
}
