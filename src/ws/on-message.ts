import * as jwt from 'jsonwebtoken'
import * as WebSocket from 'ws'
import { Message, subscribe } from './message'
import { config } from '../env'
import { AppSocket, SocketWeb, Token, WebPayload } from './types'
import { logger } from 'src/logger'

const allUsers = new Set<WebSocket>()

const userMap = new Map<string, WebSocket[]>()

subscribe(listener)

function listener(msg: Message) {
  const { type, payload } = msg

  const output = JSON.stringify({ type, payload })

  const sockets = msg.target === 'all' ? getAllSockets() : getUserSockets(msg.target)

  for (const ws of sockets) {
    ws.send(output)
  }
  return
}

const handlers: {
  [type in SocketWeb['type']]: (ws: AppSocket, data: Extract<SocketWeb, { type: type }>) => void
} = {
  login: (ws, data) => handleLogin(ws, data),
  logout: (ws) => logoutSocket(ws),
  ping: (client) => {
    client.dispatch({ type: 'pong' })
  },
}

export async function handleMessage(ws: AppSocket, data: SocketWeb) {
  const handler = handlers[data.type]
  if (!handler) return

  handler(ws, data as any)
}

export function onSocketMessage(socket: WebSocket) {
  const ws = socket as AppSocket
  ws.dispatch = (data: any) => ws.send(JSON.stringify(data))
  allUsers.add(ws)

  ws.on('message', async (msg) => {
    try {
      const data: SocketWeb = JSON.parse(msg as string)
      logger.debug({ userId: ws.userId, data }, `Socket message rcvd`)
      if ('type' in data === false) return
      if (ws.token && isExpired(ws.token)) {
        ws.userId = undefined
        ws.token = undefined
      }

      await handleMessage(ws, data)
    } catch (ex) {
      // Intentional NOOP
    }
  })

  ws.on('close', () => {
    allUsers.delete(ws)
    logoutSocket(ws)
  })
}

function logoutSocket(ws: AppSocket) {
  const userId = ws.userId
  if (!userId) return

  const sockets = userMap.get(userId) || []
  const nextSockets = sockets.filter((socket) => socket !== ws)
  userMap.set(userId, nextSockets)
}

function handleLogin(socket: WebSocket, msg: WebPayload<'login'>): string | void {
  const ws = socket as AppSocket
  if (msg.type !== 'login') return

  try {
    const payload = jwt.verify(msg.token, config.jwtSecret) as any
    const sockets = userMap.get(payload.userId) || []
    sockets.push(socket)
    ws.userId = payload.userId
    userMap.set(payload.userId, sockets)
    ws.dispatch({ type: 'login', payload: { success: true } })
  } catch (ex) {
    ws.dispatch({ type: 'login', payload: { success: false } })
  }
}

function getUserSockets(userId: string | string[]) {
  if (Array.isArray(userId)) {
    const sockets: WebSocket[] = []
    for (const id of userId) {
      sockets.push(...(userMap.get(id) || []))
    }
    return sockets
  }

  const sockets = userMap.get(userId) || []
  return sockets.slice()
}

function getAllSockets() {
  return Array.from(allUsers)
}

function isExpired(token: Token, grace?: boolean) {
  const expires = token.exp * 1000
  const expiredAgeMins = (Date.now() - expires) / 60000

  if (grace) {
    if (expiredAgeMins > 0) return true
  }

  return expires < Date.now()
}
