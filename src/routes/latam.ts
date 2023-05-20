import { FastifyInstance } from 'fastify'

export async function latamRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    return { latam: true }
  })
}
