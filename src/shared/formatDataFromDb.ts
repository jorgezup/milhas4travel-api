const formatDataFromDb = (flights: any[]) => {
  return flights.map((flight: any) => {
    const {
      searchId,
      options,
      departureStation,
      arrivalStation,
      departureDate,
      lowestPoints,
      highestPoints,
      searchDate,
      flightData: { qtdOfFlights },
    } = flight

    const flights = flight.flightData.flights.map((flight: any) => {
      const { value, connection, duration, airportConnections } = flight

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
      departureStation,
      arrivalStation,
      departureDate,
      lowestPoints,
      highestPoints,
      searchDate,
      flightData: {
        qtdOfFlights,
        flights,
      },
    }
  })
}

export default formatDataFromDb
