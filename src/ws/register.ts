import * as jwt from 'jsonwebtoken'
import * as WebSocket from 'ws'
import { Message, subscribe } from '../db/message'
import { config } from '../env'
import { AppSocket, SocketWeb } from './types'

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

export function registerSocket(socket: WebSocket) {
  const ws = socket as AppSocket
  allUsers.add(ws)

  ws.on('message', (msg) => {
    try {
      const data: SocketWeb = JSON.parse(msg as string)

      if ('type' in data === false) {
        return
      }

      // TODO: Use a dispatcher for handling messages
      switch (data.type) {
        case 'login':
          return handleLogin(data, ws)

        case 'ping':
          ws.send(JSON.stringify({ type: 'pong' }))
          return
      }
    } catch (ex) {
      // Intentional NOOP
    }
  })

  ws.on('close', () => {
    allUsers.delete(ws)

    if (ws.userId) {
      const sockets = userMap.get(ws.userId) || []

      const nextSockets = sockets.filter((socket) => socket !== ws)
      userMap.set(ws.userId, nextSockets)
    }
  })
}

function handleLogin(msg: SocketWeb, socket: WebSocket): string | void {
  const ws = socket as AppSocket
  if (msg.type !== 'login') return

  try {
    const payload = jwt.verify(msg.payload.token, config.jwtSecret) as any
    const sockets = userMap.get(payload.userId) || []
    sockets.push(socket)
    ws.userId = payload.userId
    userMap.set(payload.userId, sockets)
    ws.send(JSON.stringify({ type: 'login', payload: { success: true } }))
  } catch (ex) {
    ws.send(JSON.stringify({ type: 'login', payload: { success: false } }))
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
