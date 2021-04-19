import * as bunyan from 'bunyan'
import * as uuid from 'uuid'
import { config } from './env'
import { NextFunction, Response } from 'express'
const PrettyStream = require('bunyan-prettystream')

const pretty = new PrettyStream()
pretty.pipe(process.stdout)

const logStream = ['dev', 'test'].includes(config.appEnv) ? pretty : process.stdout

export type Logger = bunyan

export const logger = bunyan.createLogger({
  name: 'app',
  level: getLogLevel(),
  serializers: {
    err: bunyan.stdSerializers.err,
    req: bunyan.stdSerializers.req,
    res: bunyan.stdSerializers.res,
  },
  stream: logStream,
})

export function logMiddleware(req: any, res: Response, next: NextFunction) {
  const log = logger.child({})
  log.fields.requestId = uuid.v4()
  log.fields.req = {
    url: req.url,
    method: req.method,
    body: req.body,
  }

  req.log = log

  req.log.info('start request')
  const start = Date.now()
  res.on('finish', () => {
    const duration = Date.now() - start
    log.fields.duration = duration
    log.fields.res = {
      statusCode: res.statusCode,
    }
    req.log.info('end request')
  })

  next()
}

export function createLogger(name: string) {
  const log = logger.child({})
  logger.fields.name = name

  return log
}

function getLogLevel(logLevel?: string): number {
  switch (logLevel || config.logLevel) {
    case 'fatal':
      return 60
    case 'error':
      return 50
    case 'warn':
      return 40
    case 'info':
      return 30
    case 'debug':
      return 20
    case 'trace':
      return 10
  }

  return 30
}
