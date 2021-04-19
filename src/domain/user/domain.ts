import { createDomain } from 'evtstore'
import { UserEvent, UserAggregate, UserCmd } from './types'
import { getProvider } from '../util'

export const domain = createDomain<UserEvent, UserAggregate, UserCmd>(
  {
    stream: 'users',
    provider: getProvider<UserEvent>(),
    useCache: true,
    aggregate: () => ({
      state: 'new',
      alias: '',
      email: '',
      isAdmin: false,
    }),
    fold: (ev) => {
      switch (ev.type) {
        case 'UserCreated':
          return { state: 'created' }

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
  },
  {
    CreateUser: async (cmd, agg) => {
      if (agg.state !== 'new') throw new Error('Command: User already exists')
      return {
        type: 'UserCreated',
        aggregateId: cmd.aggregateId,
        isAdmin: cmd.isAdmin === true,
      }
    },
    UpdateAlias: async (cmd, agg) => {
      if (agg.state === 'new') throw new Error('User does not exist')
      return {
        type: 'AliasUpdated',
        aggregateId: cmd.aggregateId,
        alias: cmd.alias,
      }
    },
    UpdateEmail: async (cmd, agg) => {
      if (agg.state === 'new') throw new Error('User does not exist')
      return {
        type: 'EmailUpdated',
        aggregateId: cmd.aggregateId,
        email: cmd.email,
      }
    },
    RequestReset: async (_, agg) => {
      if (!agg.email) {
        throw new Error('Account has no email')
      }
    },
    ChangePassword: async (_, agg) => {
      if (agg.state === 'new') throw new Error('User does not exist')
      return { type: 'PasswordChanged' }
    },
  }
)
