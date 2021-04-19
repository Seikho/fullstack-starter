import { userDomain } from 'src/domain/user'
import * as store from './store'

const mgr = userDomain.handler('user-mgr-bookmark')

export const userManager = {
  store,
  handler: mgr,
}

mgr.handle('UserCreated', async (id, ev) => {
  await store.createUser({
    userId: id,
    alias: '',
    email: '',
    isAdmin: ev.isAdmin === true,
  })
})

mgr.handle('AliasUpdated', async (id, { alias }) => {
  await store.setUser(id, { alias })
})

mgr.handle('EmailUpdated', async (id, { email }) => {
  await store.setUser(id, { email })
})
