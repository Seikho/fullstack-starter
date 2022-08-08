import * as WebSocket from 'ws'

export type SocketApi = { type: 'pong' } | { type: 'auth'; success: boolean }

export type SocketWeb = { type: 'login'; token: string } | { type: 'logout' } | { type: 'ping' }

export type Payload<T extends SocketApi['type']> = Extract<SocketApi, { type: T }>

export type WebPayload<T extends SocketWeb['type']> = Extract<SocketWeb, { type: T }>

export type AppSocket = WebSocket & {
  userId?: string
  dispatch: (data: object) => void
  isAlive: boolean
  data: any
  token?: Token | null
}

export type Token = {
  sub: string
  userId: string
  exp: number
  iat: number
}
