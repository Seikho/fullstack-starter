import { Db, MongoClient } from 'mongodb'
import { logger } from 'src/logger'
import { config } from '../env'
import { Auth, UserProfile } from './schema'

export const names = {
  auth: 'auth',
  userProfiles: 'userProfiles',
  session: 'sessions',
}

export const tables = {
  events: () => getDb().collection<any>(config.db.events),
  bookmarks: () => getDb().collection<any>(config.db.bookmarks),
  userProfiles: () => getDb().collection<UserProfile>(names.userProfiles),
  auth: () => getDb().collection<Auth>(names.auth),
}

const uri = `mongodb://${config.db.host}`
let database: Db | null = null

export const dbClient = MongoClient.connect(uri, { ignoreUndefined: true })

export const db = dbClient.then((client) => {
  logger.info(`Connected to database (${config.db.host}/${config.db.database})`)
  const conn = client.db(config.db.database)
  database = conn
  return conn
})

export function setDb(db: Db) {
  database = db
}

export function getClient() {
  if (!database) throw new Error('Database not yet initialised')
  return dbClient
}

export function getDb() {
  if (!database) throw new Error('Database not yet initialised')
  return database
}
