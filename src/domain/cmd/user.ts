import { createCommands } from 'evtstore'
import { domain } from '../agg'
import { UserAggregate, UserCmd, UserEvent } from '../types/user'

export const userCmd = createCommands<UserEvent, UserAggregate, UserCmd>(domain.user, {
  CreateUser: async (cmd, agg) => {
    if (agg.state !== 'new') throw new Error('Command: User already exists')
    return {
      type: 'UserCreated',
      aggregateId: cmd.aggregateId,
      isAdmin: cmd.isAdmin === true,
      username: cmd.username,
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
})
