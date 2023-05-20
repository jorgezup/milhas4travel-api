import { FastifyInstance } from 'fastify'

export async function smilesRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    return { smiles: true }
  })
}
