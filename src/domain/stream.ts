import { UserEvent } from './user/types'

export const streams = {
  users: 'users',
} as const

export type EventMap = {
  [streams.users]: UserEvent
}
