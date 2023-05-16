import {FastifyInstance} from "fastify";

export async function interlineRoutes(app: FastifyInstance) {
    app.get('/', async () => {
        return { interline: true }
    })
}