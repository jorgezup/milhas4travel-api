import moment from 'moment/moment'
import { BodyRequestInterface } from '../interfaces/flightDataInterface'

export const setBodyRequest = (
  departure: string,
  arrival: string,
  date: string,
): BodyRequestInterface => ({
  criteria: [
    {
      departureStation: departure,
      arrivalStation: arrival,
      std: moment(date, 'DD/MM/YYYY').format('MM/DD/YYYY'),
      departureDate: moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD'),
    },
  ],
  passengers: [
    {
      type: 'ADT',
      count: '1',
      companionPass: 'false',
    },
  ],
  flexibleDays: {
    daysToLeft: '3',
    daysToRight: '3',
  },
  currencyCode: 'BRL',
})
