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
    // app.get('/', async () => {
    //     return {azul: true}
    // })

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

        const data = await getAzulFlights(bodyRequest, bearerToken);

        if (data === undefined) return {message: "No flights found for this date."}

        if (data.trips !== undefined && data.trips.length > 0) {
            if (data.trips[0].flightType === null) {
                return {message: "No flights found for this date."}
            } else {
                const {lowestPoints, highestPoints} = data.trips[0].fareInformation;

                return {
                    departureStation: data.trips[0].departureStation,
                    arrivalStation: data.trips[0].arrivalStation,
                    departureDate: moment(data.trips[0].std).format("DD/MM/YYYY"),
                    lowestPoints: lowestPoints,
                    highestPoints: highestPoints,
                    searchDate: moment().format("DD/MM/YYYY HH:mm:ss")
                };
            }
        }

        return {message: "No flights found for this date."};
    })
}