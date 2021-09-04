import { create, logger } from 'svcready'
import api from './api'
import { auth } from './db/auth'
import { config } from './env'

export const server = create({
  logging: true,
  sockets: true,
  port: config.port,
  auth: {
    trustProxy: true,
    secret: config.jwtSecret,
    cookie: {
      secure: false,
      sameSite: 'strict',
    },
    getUser: async (id) => {
      const user = await auth.getUser(id)
      if (!user) return
      return { userId: user.userId, hash: user.hash }
    },
  },
})

const { app } = server

app.use('/api', api)

process.on('SIGTERM', () => {
  server.stop()
  logger.info(`Server stopped. App received SIGTERM`)
})
