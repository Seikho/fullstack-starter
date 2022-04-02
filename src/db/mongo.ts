import { Db, MongoClient } from 'mongodb'
import { config } from '../env'
import { Auth, UserProfile } from './schema'

export const names = {
  auth: 'auth',
  userProfiles: 'userProfiles',
}

export const tables = {
  events: () => getDb().collection<any>(config.db.events),
  bookmarks: () => getDb().collection<any>(config.db.bookmarks),
  userProfiles: () => getDb().collection<UserProfile>(names.userProfiles),
  auth: () => getDb().collection<Auth>(names.auth),
}

const uri = `mongodb://${config.db.host}`
let database: Db | null = null

export const db = MongoClient.connect(uri, { ignoreUndefined: true }).then((client) => {
  const conn = client.db(config.db.database)
  database = conn
  return conn
})

export function setDb(db: Db) {
  database = db
}

export function getDb() {
  if (!database) throw new Error('Database not yet initialised')
  return database
}
