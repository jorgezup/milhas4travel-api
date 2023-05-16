import {FastifyInstance} from "fastify";
import moment from "moment";
import {getBearerTokenAzul} from "../shared/getBearerTokenAzul";
import {getAzulFlights} from "../shared/getAzulFlights";


interface AzulSearchRequest {
    departure: string,
    arrival: string,
    date: string
}

export async function azulRoutes(app: FastifyInstance) {
    app.post('/search', async (request) => {
        const {departure, arrival, date}: AzulSearchRequest = request.body;

        const bodyRequest = {
            "criteria": [
                {
                    "departureStation": departure,
                    "arrivalStation": arrival,
                    "std": moment(date, "DD/MM/YYYY").format("MM/DD/YYYY"),
                    "departureDate": moment(date, "DD/MM/YYYY").format("YYYY-MM-DD")
                }
            ],
            "passengers": [
                {
                    "type": "ADT",
                    "count": "1",
                    "companionPass": "false"
                }
            ],
            "flexibleDays": {
                "daysToLeft": "3",
                "daysToRight": "3"
            },
            "currencyCode": "BRL"
        }

        const bearerToken = await getBearerTokenAzul();

        const {trips: [travel]} = await getAzulFlights(bodyRequest, bearerToken);

        if (travel.journeys === null) return {message: "No flights found for this date."}

        const flightData = {
            qtdOfFlights: travel.journeys.length,
            flights: []
        };

        const journeys = travel.journeys;
        for (let i = 0; i < journeys.length; i++) {
            const journey = journeys[i];
            const fares = journey.fares[0];
            const paxPoints = fares.paxPoints[0];
            const levels = paxPoints.levels[0];

            const flight = {
                value: levels.points,
                connection: journey.identifier.connections?.count,
                duration: `${journey.identifier.duration.hours}:${journey.identifier.duration.minutes}`,
                airportConnections: journey.identifier.connections?.count > 0 ? [] : undefined
            };

            if (flight.connection > 0) {
                const stationsInformation = journey.identifier.connections.stationsInformation;
                for (let j = 0; j < stationsInformation.length; j++) {
                    flight.airportConnections.push(stationsInformation[j].code);
                }
            }

            flightData.flights.push(flight);
        }

        return {
            departureStation: travel.departureStation,
            arrivalStation: travel.arrivalStation,
            departureDate: moment(travel.std).format("DD/MM/YYYY"),
            lowestPoints: travel.fareInformation.lowestPoints,
            highestPoints: travel.fareInformation.highestPoints,
            searchDate: moment().format("DD/MM/YYYY HH:mm:ss"),
            flightData: flightData
        };

    })
}