require('module-alias/register')
import { logger } from 'svcready'
import { auth } from './db/auth'
import { db, setDb } from './db/mongo'
import { migrate } from './db/migrate'
import { userCmd } from './domain/cmd/user'
import { config } from './env'
import { userManager } from './manager/user'
import { server } from './server'
import { initiate } from './ws/message'

export async function start() {
  await migrate()
  await initiate()

  const client = await db
  setDb(client)

  userManager.handler.start()
  server.start()

  const user = await auth.getUser(config.init.user)
  if (!user) {
    const lowered = config.init.user.toLowerCase()
    await auth.createUser(config.init.user, config.init.password)
    await userCmd.CreateUser(config.init.user, { isAdmin: true, username: lowered })
    logger.info({ user: config.init.user }, 'Created default user')
  }
}
