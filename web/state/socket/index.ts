import { SocketApi, SocketWeb } from 'src/ws/types'
import { createStore, Dispatcher } from '../create'
import { config } from '../config'
import { hydrateToken } from '../util'

const BASE_RETRY = 250
const MAX_RETRY = 5000
let RETRY_TIME = 0

type Socket = WebSocket & { connected: boolean }

type SocketAction =
  | { type: 'INIT' }
  | { type: 'UPDATE'; socket?: Socket; connected?: boolean; authed?: boolean }
  | { type: 'LOGIN'; token?: string }
  | { type: 'LOGOUT' }
  | { type: 'SEND'; payload: SocketWeb }
  | { type: 'RECEIVE'; data: SocketApi }

export type SocketState = {
  init: boolean
  socket?: Socket
  connected: boolean
  authed: boolean
}

export const socketStore = createStore<SocketState, SocketAction>(
  'socket',
  { init: false, connected: false, authed: false },
  {
    __INIT: (_, __, dispatch) => {
      const socket = createSocket(dispatch)
      return { socket }
    },
    UPDATE: (state, { socket, connected, authed }, dispatch) => {
      if (connected === true) {
        const token = hydrateToken()
        if (!token) return
        dispatch({ type: 'LOGIN', token })
      }

      const nextState = { ...state }

      if (socket) nextState.socket = socket
      if (connected !== undefined) nextState.connected = connected
      if (authed !== undefined) nextState.authed = authed

      return nextState
    },
    LOGIN: ({ socket, authed }, { token }, dispatch) => {
      if (!socket) return
      if (!token) return
      if (!socket.connected) return
      if (authed) return

      dispatch({ type: 'SEND', payload: { type: 'login', payload: { token } } })
    },
    SEND: ({ socket }, action) => {
      if (!socket) return
      socket.send(JSON.stringify(action.payload))
    },
    RECEIVE: (_, { data: payload }) => {
      switch (payload.type) {
        case 'login':
          return {
            authed: payload.payload.success,
          }
      }
    },
  }
)

const persistentListeners = new Map<number, any>()

function createSocket(dispatch: Dispatcher<SocketState, SocketAction>) {
  const base = config.apiUrl.replace('http://', 'ws://').replace('https://', 'wss://')
  const ws = new WebSocket(base + '/ws') as Socket
  ws.connected = false
  let waitingPong = false

  ws.onopen = () => {
    ws.connected = true
    RETRY_TIME = 0
    dispatch({ type: 'UPDATE', connected: true })

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

        dispatch({ type: 'RECEIVE', data: payload })
        for (const [, listener] of persistentListeners.entries()) {
          listener(payload)
        }
      } catch (ex) {
        console.log('failed to parse', ex)
      }
    }
  }

  ws.onclose = () => {
    dispatch({ type: 'UPDATE', connected: false, authed: false, socket: undefined })

    ws.connected = false

    RETRY_TIME = RETRY_TIME === 0 ? BASE_RETRY : RETRY_TIME * 2

    if (RETRY_TIME > MAX_RETRY) RETRY_TIME = MAX_RETRY

    setTimeout(() => {
      dispatch({ type: 'UPDATE', socket: createSocket(dispatch) })
    }, RETRY_TIME)
  }

  ws.onerror = (_error: any) => {
    ws.close()
  }

  return ws
}
