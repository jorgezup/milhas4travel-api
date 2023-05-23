import { randomUUID } from 'crypto'
import { FastifyReply, FastifyRequest } from 'fastify'

const getCookie = (request: FastifyRequest, reply: FastifyReply) => {
  let sessionId = request.cookies.sessionId

  if (!sessionId) {
    sessionId = randomUUID()
    reply.setCookie('sessionId', sessionId, {
      path: '/', // any route can access this cookie
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days in milliseconds
    })
  }

  return sessionId
}

export default getCookie
