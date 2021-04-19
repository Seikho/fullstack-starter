import * as path from 'path'
import { config } from '../env'
const migrationsDir = path.resolve(__dirname, 'migrations')

export = {
  mongodb: {
    url: `mongodb://${config.db.host}`,
    databaseName: config.db.database,
    options: { useNewUrlParser: true },
  },
  changelogCollectionName: 'changelog',
  migrationsDir,
}
