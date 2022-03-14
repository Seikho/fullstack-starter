import { createAggregate } from 'evtstore'
import { UserAggregate, UserEvent, UserStream } from '../types/user'

export const user = createAggregate<UserEvent, UserAggregate, UserStream>({
  stream: 'users',
  create: () => ({
    state: 'new',
    alias: '',
    email: '',
    isAdmin: false,
  }),
  fold: (ev) => {
    switch (ev.type) {
      case 'UserCreated':
        return { state: 'created', isAdmin: ev.isAdmin }

      case 'AliasUpdated':
        return { alias: ev.alias }

      case 'EmailUpdated':
        return { email: ev.email }

      case 'PasswordReset': {
        return {}
      }

      case 'PasswordChanged': {
        return {}
      }
    }
  },
})
