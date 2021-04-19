import * as WebSocket from 'ws'
export type SocketApi = { type: 'login'; payload: { success: boolean } }

export type SocketWeb = { type: 'login'; payload: { token: string } } | { type: 'ping' }

export type Payload<T extends SocketApi['type']> = Extract<SocketApi, { type: T }>['payload']

export type AppSocket = WebSocket & {
  userId?: string
}
