import { Schema, model } from 'mongoose'

const AzulFlightSchema = new Schema({
  searchId: String,
  sessionId: String,
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
        connection: Number,
        duration: String,
        airportConnections: [String],
      },
    ],
  },
})

const AzulFlight = model('AzulFlight', AzulFlightSchema)

export default AzulFlight
