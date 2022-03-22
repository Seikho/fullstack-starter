import * as redis from 'redis'
import { config } from 'src/env'

export const clients = {
  pub: redis.createClient({ url: getUri() }),
  sub: redis.createClient({ url: getUri() }),
}

function getUri() {
  let creds = config.redis.user || ''
  if (creds && config.redis.password) creds += `:${config.redis.password}`
  if (creds) creds += '@'

  return `redis://${creds}${config.redis.host}:${config.redis.port}`
}
