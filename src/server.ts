import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as cors from 'cors'
import { config } from './env'
import { logMiddleware, createLogger } from './logger'
import api from './api'
import web from './api/web'
import { setupWebsocketServer } from './ws'
import { CommandError } from 'evtstore'

export function createServer(id: number): void {
  const { app, log } = createApp(id)
  const port = config.port

  const server = app.listen(port, () => {
    log.info(`App is running at http://localhost:${port}/ in ${app.get('env')} mode.`)
    log.info('Press CTRL-C to stop.')
  })

  const { interval } = setupWebsocketServer(server)

  process.on('SIGTERM', () => {
    server.close(() => {
      clearInterval(interval)
      log.info(`Server stopped. App received SIGTERM`)
    })
  })
}

export function createApp(id: number) {
  const log = createLogger('api')
  log.fields.workerId = id
  const app = express()

  app.use(logMiddleware)
  app.use(cors())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json())

  app.use('/api', api)
  app.use(web)

  app.use(errorHandler)

  return { app, log }
}

function errorHandler(
  err: any,
  req: express.Request,
  res: express.Response,
  _next: express.NextFunction
) {
  if (err instanceof CommandError) {
    const code = err.code || 'UNKNOWN'
    res.status(400).send({ message: err.message, code })
    return
  }

  const message = err.status ? err.message : 'Internal server error'
  req.log.error({ err }, 'Unhandled exception')
  res.status(err.status || 500).send({ message })
  return
}
