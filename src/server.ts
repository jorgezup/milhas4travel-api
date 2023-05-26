import fastify from 'fastify'
import { env } from './env'
import { azulRoutes } from './routes/azul'
import { latamRoutes } from './routes/latam'
import { interlineRoutes } from './routes/interline'
import { smilesRoutes } from './routes/smiles'
import cookie from '@fastify/cookie'
import connectToDatabase from './db'
import queue from './queue'

const app = fastify({ logger: true })

app.register(cookie)

app.get('/', async () => {
  return { hello: 'world' }
})

app.get('/jobs', async () => {
  // Obter informações sobre a fila
  const queueInfo = await queue.getJobCounts()

  // Obter todos os jobs pendentes na fila
  const pendingJobs = await queue.getJobs(['waiting', 'active'])

  return { queueInfo, pendingJobs }
})

app.register(azulRoutes, { prefix: '/azul' })
app.register(interlineRoutes, { prefix: '/interline' })
app.register(latamRoutes, { prefix: '/latam' })
app.register(smilesRoutes, { prefix: '/smiles' })

connectToDatabase()
  .then(() => {
    console.log('Connected to database')
    app.listen({ port: env.PORT, host: env.HOST }).then(() => {
      console.log(`Server is listening on port ${env.PORT}`)
    })
  })
  .catch((error) => {
    console.log('Connection with database generated an error:\r\n')
    console.error(error)
    console.log('\r\nServer initialization cancelled')
    process.exit(0)
  })
