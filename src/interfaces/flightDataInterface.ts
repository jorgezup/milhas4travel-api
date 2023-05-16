interface FlightDataInterface {
    trips?: [
        {
            flightType: string | null,
            departureStation: string,
            arrivalStation: string,
            std: string,
            fareInformation: {
                lowestPoints: number,
                highestPoints: number
            }
        }
    ]
}