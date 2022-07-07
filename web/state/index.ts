import * as user from './user'
import * as toast from './toast'
import * as socket from './socket'

export const stores = {
  user: user.userStore,
  toast: toast.toastStore,
  socket: socket.socketStore,
}
