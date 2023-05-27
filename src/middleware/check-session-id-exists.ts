import { FastifyReply, FastifyRequest } from 'fastify'
import { randomUUID } from 'crypto'

export async function checkSessionIdExistsMiddleware(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const sessionId = request.cookies.sessionId
  if (!sessionId) {
    const sessionId = randomUUID()
    reply.setCookie('sessionId', sessionId, {
      path: '/', // the cookie will be available for all routes
      httpOnly: true, // not accessible from javascript
      sameSite: 'lax', // csrf
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })
  }
}
