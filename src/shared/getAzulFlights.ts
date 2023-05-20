import { FlightDataInterface } from '../interfaces/flightDataInterface'

export async function getAzulFlights(
  body: any,
  token: string,
): Promise<FlightDataInterface | undefined> {
  const response = await fetch(
    'https://b2c-api.voeazul.com.br/tudoAzulReservationAvailability/api/tudoazul/reservation/availability/v4/availability',
    {
      headers: {
        accept: 'application/json, text/plain, */*',
        'accept-language': 'pt-BR,pt;q=0.6',
        authorization: token,
        'content-type': 'application/json',
        culture: 'pt-BR',
        device: 'novosite',
        'ocp-apim-subscription-key': '0fc6ff296ef2431bb106504c92dd227c',
        'sec-ch-ua':
          '"Brave";v="113", "Chromium";v="113", "Not-A.Brand";v="24"',
        'sec-ch-ua-mobile': '?1',
        'sec-ch-ua-platform': '"Android"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
        'sec-gpc': '1',
      },
      referrer: 'https://www.voeazul.com.br/',
      referrerPolicy: 'strict-origin-when-cross-origin',
      body: JSON.stringify(body),
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
    },
  )
  const responseJson = await response.json()
  return responseJson.data
}
