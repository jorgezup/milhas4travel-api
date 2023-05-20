export async function getBearerTokenAzul() {
  const response = await fetch(
    'https://b2c-api.voeazul.com.br/authentication/api/authentication/v1/token',
    {
      headers: {
        accept: 'application/json, text/plain, */*',
        'accept-language': 'pt-BR,pt;q=0.6',
        authorization: '',
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
      body: null,
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
    },
  )

  const token = await response.json()

  return `Bearer ${token.data}`
}
