import { DomainEvent, DomainCmd } from '../util'

export type UserEvent =
  | DomainEvent<'UserCreated', { isAdmin: boolean; username: string }>
  | DomainEvent<'AliasUpdated', { alias: string }>
  | DomainEvent<'EmailUpdated', { email: string }>
  | DomainEvent<'PasswordReset', { token: string }>
  | DomainEvent<'PasswordChanged'>

export type UserCmd =
  | DomainCmd<'CreateUser', { isAdmin?: boolean; username: string }>
  | DomainCmd<'RequestReset', { isAdmin: boolean }>
  | DomainCmd<'ChangePassword'>
  | DomainCmd<'UpdateAlias', { alias: string }>
  | DomainCmd<'UpdateEmail', { email: string }>

export interface User {
  expires: number
  userId: string
  alias?: string
  email?: string
  isAdmin?: boolean
}

export interface UserAggregate {
  state: 'new' | 'created'
  alias: string
  email: string
  isAdmin: boolean
}

export interface UserProfile {
  userId: string
  alias?: string
  email?: string
  isAdmin?: boolean
}
