import {FastifyInstance} from "fastify";

export async function azulRoutes(app: FastifyInstance) {
    app.get('/', async () => {
        return { azul: true }
    })
}