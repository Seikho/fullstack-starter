import session from 'express-session'
import cors from 'cors'
import { create, logger } from 'svcready'
import api from './api'
import { sessionMiddleware } from './api/middleware/auth'
import { config } from './env'
import { registerSocket } from './ws/register'
import { setup } from './socket'

export const server = create({
  logging: true,
  port: config.port,
})

server.onConnect((socket) => registerSocket(socket))

const { app } = server

setup()

app.use(cors())
app.set('trust proxy', 1)
app.use(
  session({
    proxy: true,
    secret: config.jwtSecret,
    cookie: {
      httpOnly: true,
      maxAge: 10000 * 60 * 1000,
      sameSite: 'strict',
      secure: false,
    },
    resave: false,
    saveUninitialized: true,
  })
)
app.use(sessionMiddleware)
app.use('/api', api)

process.on('SIGTERM', () => {
  server.stop()
  logger.info(`Server stopped. App received SIGTERM`)
})
