import * as path from 'path'
import { createLogger } from '../logger'
import { ensureIndexes } from './indexes'
import { migrate as migrateEvts } from 'evtstore/provider/mongo'
import { Db } from 'mongodb'
import { table } from './event'
import { config } from 'src/env'

type EnsureFunc = (db: Db) => Promise<void>

export async function migrate() {
  await run(path.resolve(__dirname, 'settings.js'), ensureIndexes)
  const events = await table.events
  const bookmarks = await table.bookmarks
  await migrateEvts(events, bookmarks)
}

async function run(configFile: string, ensure: EnsureFunc) {
  const database = require('migrate-mongo').database
  const up = require('migrate-mongo').up

  const log = createLogger(`migrations`)

  /**
   * migrate-mongo will use global.options.file or coalesce to
   * migrate-mongo.config.js if global.options.file is not set
   */

  const cfg: any = global
  cfg.options = {
    file: configFile,
  }

  log.info('Connecting')
  const { client } = await database.connect()
  const db = client.db(config.db.database)
  log.info(`Migrating...`)
  try {
    const applied = await up(db)
    if (applied.length) {
      log.info({ applied }, `Successfully migrated`)
    }
    await ensure(db)
    log.info('Successfully ensured indexes')
  } catch (err) {
    log.error({ err }, 'Failed to migrate')
  }
}
