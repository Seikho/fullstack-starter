import { Server } from 'http'
import { logger } from 'src/logger'
import * as ws from 'ws'
import { onSocketMessage } from './on-message'
import { AppSocket } from './types'

export function setupSocketServer(srv: Server) {
  const sockets = new ws.Server({ server: srv, path: '/ws' })
  logger.debug(`WebSocket server started`)
  check(sockets)

  sockets.on('connection', (client: AppSocket) => {
    client.data = {}
    client.on('pong', heartbeat)
    logger.debug(`Socket connected`)
    onSocketMessage(client)
  })

  return { sockets }
}

function heartbeat(client: AppSocket) {
  client.isAlive = true
}

function check(server: ws.Server) {
  const interval = setInterval(() => {
    const clients = server.clients as Set<AppSocket>
    for (const client of clients) {
      if (client.isAlive === false) {
        client.terminate()
        return
      }

      client.isAlive = false
      client.ping(() => {
        client.isAlive = true
      })
    }
  }, 30000)
  return interval
}
