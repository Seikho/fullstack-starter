import * as http from 'http'
import express from 'express'
import session from 'express-session'
import cors from 'cors'
import { logger, logMiddleware } from 'src/logger'
import api from './api'
import { sessionMiddleware } from './api/middleware/auth'
import { config } from './env'
import { setupSocketServer } from './ws/setup-server'

const app = express()
export const server = new http.Server(app)

setupSocketServer(server)

app.use(express.json() as any, express.urlencoded({ extended: true }) as any)
app.use(logMiddleware())
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
  server.close()
  logger.info(`Server stopped. App received SIGTERM`)
})
