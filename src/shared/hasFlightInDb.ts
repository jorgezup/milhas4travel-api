import moment from 'moment'

const hasFlightInDb = (flight: any): boolean => {
  const searchDate = moment(flight.searchDate, 'DD/MM/YYYY HH:mm:ss')
  const currentDate = moment()
  const difference = currentDate.diff(searchDate, 'seconds')
  return !(difference > 3600) // if difference is more than one hour, return false
}

export default hasFlightInDb
