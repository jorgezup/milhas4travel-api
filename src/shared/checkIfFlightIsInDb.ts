import AzulFlight from '../models/AzulFlightModel'

const checkIfFlightIsInDb = async (
  departure: string,
  arrival: string,
  date: string,
): Promise<any | null> => {
  return AzulFlight.findOne({
    departureStation: departure.toUpperCase(),
    arrivalStation: arrival.toUpperCase(),
    departureDate: date,
  }).sort({ searchDate: -1 })
}

export default checkIfFlightIsInDb
