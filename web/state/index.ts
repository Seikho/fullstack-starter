import { socketStore } from './socket'
import { userStore } from './user'
import { toastStore } from './toast'

export const stores = {
  user: userStore,
  toast: toastStore,
  socket: socketStore,
}

export { socketStore, userStore, toastStore }
