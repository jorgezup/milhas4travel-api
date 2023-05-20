import moment from 'moment'

export function getDatesArray(dateStart: string, dateEnd: string): string[] {
  const datesArray = []
  const currentDate = moment(dateStart, 'DD/MM/YYYY')
  const endDate = moment(dateEnd, 'DD/MM/YYYY')

  // eslint-disable-next-line no-unmodified-loop-condition
  while (currentDate <= endDate) {
    datesArray.push(moment(currentDate).format('DD/MM/YYYY'))
    currentDate.add(1, 'days')
  }

  return datesArray
}
