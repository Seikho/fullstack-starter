import { createReducer } from '../create'
import { SocketApi, SocketWeb } from 'src/ws/types'

export { reducer, Socket }

type Socket = WebSocket & { connected: boolean }

type SocketAction =
  | { type: 'SOCKET_INIT' }
  | { type: 'SOCKET_UPDATE'; socket?: Socket; connected?: boolean; authed?: boolean }
  | { type: 'SOCKET_LOGIN'; token?: string }
  | { type: 'SOCKET_LOGOUT' }
  | { type: 'SOCKET_SEND'; payload: SocketWeb }
  | { type: 'SOCKET_RECEIVE'; data: SocketApi }

export type SocketState = {
  socket?: Socket
  connected: boolean
  authed: boolean
}

const { reducer, handle } = createReducer<SocketState, SocketAction>({
  connected: false,
  authed: false,
})

handle('SOCKET_UPDATE', (state, { socket, connected, authed }) => {
  const nextState = { ...state }

  if (socket) nextState.socket = socket
  if (connected !== undefined) nextState.connected = connected
  if (authed !== undefined) nextState.authed

  return nextState
})

handle('SOCKET_RECEIVE', (_, { data: payload }) => {
  switch (payload.type) {
    case 'login':
      return {
        authed: payload.payload.success,
      }
  }
})
