import { saga, store } from '../store'
import { Socket } from '../socket'
import { config } from '../config'

const BASE_RETRY = 250
const MAX_RETRY = 5000
let RETRY_TIME = 0

saga('APP_INIT', (_, dispatch) => {
  dispatch({ type: 'SOCKET_INIT' })
})

saga('SOCKET_INIT', (_, dispatch) => {
  const socket = createSocket()
  dispatch({ type: 'SOCKET_UPDATE', socket })
})

saga('SOCKET_UPDATE', (action, dispatch, { user }) => {
  if (action.connected === true) {
    dispatch({ type: 'SOCKET_LOGIN', token: user.token })
  }
  // 1. On connect, login
})

saga('SOCKET_SEND', (action, _, { socket: { socket } }) => {
  if (!socket) return
  socket.send(JSON.stringify(action.payload))
})

saga('SOCKET_LOGIN', ({ token }, dispatch, { socket: { socket, authed } }) => {
  if (!socket) return
  if (!token) return
  if (!socket.connected) return
  if (authed) return

  dispatch({ type: 'SOCKET_SEND', payload: { type: 'login', payload: { token } } })
})

const persistentListeners = new Map<number, any>()

function createSocket() {
  const base = config.apiUrl.replace('http://', 'ws://').replace('https://', 'wss://')
  const ws = new WebSocket(base + '/') as Socket
  ws.connected = false
  let waitingPong = false

  ws.onopen = () => {
    ws.connected = true
    RETRY_TIME = 0
    store.dispatch({ type: 'SOCKET_UPDATE', connected: true })
    store.dispatch({ type: 'TOAST_ADD', kind: 'info', title: 'Connected', ttl: 2 })

    const token = store.getState().user.token
    if (!token) return

    store.dispatch({ type: 'SOCKET_LOGIN', token })

    const ping = () => {
      ws.send(JSON.stringify({ type: 'ping' }))

      setTimeout(() => {
        if (waitingPong === true) {
          ws.close()
          return
        }

        waitingPong = false
        setTimeout(ping, 10000)
      }, 1500)
    }

    setTimeout(ping, 5000)
  }

  ws.onmessage = (msg) => {
    if (typeof msg.data !== 'string') {
      return
    }

    const blobs = msg.data.split('\n')
    for (const blob of blobs) {
      try {
        const payload = JSON.parse(blob)
        if (payload.type === 'pong') {
          waitingPong = false
          return
        }

        store.dispatch({ type: 'SOCKET_RECEIVE', data: payload })
        for (const [, listener] of persistentListeners.entries()) {
          listener(payload)
        }
      } catch (ex) {
        console.log('failed to parse', ex)
      }
    }
  }

  ws.onclose = () => {
    store.dispatch({ type: 'SOCKET_UPDATE', connected: false, authed: false, socket: undefined })
    if (ws.connected) {
      store.dispatch({ type: 'TOAST_ADD', kind: 'error', ttl: 1, title: 'Disconnected' })
    }

    ws.connected = false

    RETRY_TIME = RETRY_TIME === 0 ? BASE_RETRY : RETRY_TIME * 2

    if (RETRY_TIME > MAX_RETRY) RETRY_TIME = MAX_RETRY

    setTimeout(() => {
      store.dispatch({ type: 'SOCKET_UPDATE', socket: createSocket() })
    }, RETRY_TIME)
  }

  ws.onerror = (_error: any) => {
    ws.close()
  }

  return ws
}
