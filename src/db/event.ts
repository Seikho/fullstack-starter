import { Db, MongoClient } from 'mongodb'
import { config } from '../env'

const connect = MongoClient.connect

const uri = `mongodb://${config.db.host}`
let database: Db | null = null

export const tables = {
  userProfiles: 'userProfiles',
}

export const db = connect(uri, { ignoreUndefined: true }).then((client) => {
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
