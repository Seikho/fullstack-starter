import * as http from 'http'
import * as WebSocket from 'ws'
import { onSocketMessage } from './on-message'

const PING_INTERVAL = 30000

export function setupWebsocketServer(server: http.Server) {
  const wss = new WebSocket.Server({ path: '/', server })

  const interval = setInterval(() => {
    wss.clients.forEach((ws: any) => {
      if (ws.isAlive === false) {
        return ws.terminate()
      }

      ws.isAlive = false
      ws.ping(noop)
    })
  }, PING_INTERVAL)

  wss.on('connection', (ws: any) => {
    onSocketMessage(ws)

    ws.isAlive = true
    ws.on('pong', () => heartbeat(ws))
  })

  return { wss, interval }
}

function noop() {}

function heartbeat(ws: any) {
  ws.isAlive = true
}
