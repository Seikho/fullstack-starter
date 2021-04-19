import { connect } from 'mongodb'
import { config } from '../env'

const uri = `mongodb://${config.db.host}`

export const db = connect(uri, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  ignoreUndefined: true,
}).then((client) => client.db(config.db.database))

export const table = {
  events: db.then((db) => db.collection(config.db.events)),
  bookmarks: db.then((db) => db.collection(config.db.bookmarks)),
}

export const tables = {
  userProfiles: 'userProfiles',
}
