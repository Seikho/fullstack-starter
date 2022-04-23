import { createStore } from './create'
import * as user from './user'
import * as toast from './toast'
import * as socket from './socket'

export { saga, store, withState, withDispatch }

const { saga, setup } = createStore('state', {
  toast: toast.reducer,
  user: user.reducer,
  socket: socket.reducer,
})

const { store, withState, withDispatch } = setup()
