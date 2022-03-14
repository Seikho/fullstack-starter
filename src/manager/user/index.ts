import * as store from './store'
import { createHandler } from 'src/domain/agg'

const mgr = createHandler('user-mgr-bookmark', ['users'])

export const userManager = {
  store,
  handler: mgr,
}

mgr.handle('users', 'UserCreated', async (id, ev) => {
  await store.createUser({
    userId: id,
    alias: '',
    email: '',
    isAdmin: ev.isAdmin === true,
  })
})

mgr.handle('users', 'AliasUpdated', async (id, { alias }) => {
  await store.setUser(id, { alias })
})

mgr.handle('users', 'EmailUpdated', async (id, { email }) => {
  await store.setUser(id, { email })
})
