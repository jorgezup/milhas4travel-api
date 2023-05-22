import { Schema, model } from 'mongoose'

const AzulFlightSchema = new Schema({
  departureStation: String,
  arrivalStation: String,
  departureDate: String,
  lowestPoints: Number,
  highestPoints: Number,
  searchDate: String,
  flightData: {
    qtdOfFlights: Number,
    flights: [
      {
        value: Number,
        duration: String,
        airportConnections: [String],
      },
    ],
  },
})

const AzulFlight = model('AzulFlight', AzulFlightSchema)

export default AzulFlight
