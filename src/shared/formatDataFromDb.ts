const formatDataFromDb = (flight: any) => {
  const {
    searchId,
    options,
    departureStation,
    arrivalStation,
    departureDate,
    lowestPoints,
    highestPoints,
    searchDate,
  } = flight[0]
  const { qtdOfFlights, flights } = flight[0].flightData

  const formattedFlights = flights.map((flightData: any) => {
    const { value, connection, duration, airportConnections } = flightData
    return {
      value,
      connection,
      duration,
      airportConnections,
    }
  })

  return {
    searchId,
    options,
    data: {
      departureStation,
      arrivalStation,
      departureDate,
      lowestPoints,
      highestPoints,
      searchDate,
      flightData: {
        qtdOfFlights,
        flights: formattedFlights,
      },
    },
  }
}

export default formatDataFromDb
