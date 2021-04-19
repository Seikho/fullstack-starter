import { domain } from './domain'
import * as UserDomain from './types'
import {} from './types'

export { UserDomain }

export const userDomain = {
  cmd: domain.command,
  handler: domain.handler,
  get: domain.getAggregate,
}
