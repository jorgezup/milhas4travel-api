import { Queue, Worker } from 'bullmq'
import { env } from '../env'
import { getAzulFlights } from '../shared/getAzulFlights'
import { getFlightData } from '../shared/getFlightData'
import AzulFlight from '../models/AzulFlightModel'
import { getBearerTokenAzul } from '../shared/getBearerTokenAzul'

const queue = new Queue('queue', {
  connection: { host: env.REDIS_HOST, port: Number(env.REDIS_PORT) },
})

// @ts-ignore
// eslint-disable-next-line no-unused-vars
const worker = new Worker(
  'queue',
  async (job) => {
    const { bodyRequest, searchId, sessionId } = job.data

    const bearerToken = await getBearerTokenAzul()

    const response = await getAzulFlights(bodyRequest, bearerToken)

    if (response === undefined || response.trips[0].flightType === null) {
      return
    }

    const flightData = getFlightData(response)

    const dataToSave = { ...flightData, searchId, sessionId }

    const flightToSave = new AzulFlight(dataToSave)

    await flightToSave.save()
  },
  { connection: { host: env.REDIS_HOST, port: Number(env.REDIS_PORT) } },
)

worker.on('failed', (job, err) => {
  // @ts-ignore
  console.log(`Job ${job.id} failed with ${err.message}`)
})

export default queue
