import { config } from 'src/env'
import { getDb } from './event'

export const names = {
  auth: 'auth',
}

export const tables = {
  events: () => getDb().collection<any>(config.db.events),
  bookmarks: () => getDb().collection<any>(config.db.bookmarks),
}
