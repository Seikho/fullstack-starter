export type UserEvent =
  | { type: 'UserCreated'; isAdmin: boolean; username: string }
  | { type: 'AliasUpdated'; alias: string }
  | { type: 'EmailUpdated'; email: string }
  | { type: 'PasswordReset'; token: string }
  | { type: 'PasswordChanged' }

export type UserCmd =
  | { type: 'CreateUser'; isAdmin?: boolean; username: string }
  | { type: 'RequestReset'; isAdmin: boolean }
  | { type: 'ChangePassword' }
  | { type: 'UpdateAlias'; alias: string }
  | { type: 'UpdateEmail'; email: string }

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

export type UserStream = 'users'
