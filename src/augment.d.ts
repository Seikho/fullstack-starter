import * as core from 'express-serve-static-core'
import { Logger } from './logger'
import * as Socket from 'ws'

declare module 'express-serve-static-core' {
  interface Request {
    log: Logger
    user?: AuthToken
    token?: string
  }
}

declare module 'ws' {
  class WebSocket extends Socket {
    userId?: string
  }
}
