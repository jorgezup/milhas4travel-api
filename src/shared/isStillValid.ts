import moment from 'moment/moment'
import { FlightInDb } from '../interfaces/flightDataInterface'

const isItStillValid = (flight: FlightInDb): boolean => {
  const searchDate = moment(flight.searchDate, 'DD/MM/YYYY HH:mm:ss')
  const currentDate = moment()
  const difference = currentDate.diff(searchDate, 'seconds')
  return difference <= 3600 // Return true if the difference is less than or equal to one hour
}

export default isItStillValid
