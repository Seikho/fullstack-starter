require('module-alias/register')
import { auth } from './db/auth'
import { migrate } from './db/migrate'
import { userDomain } from './domain/user'
import { config } from './env'
import { logger } from './logger'
import { userManager } from './manager/user'
import { createServer } from './server'

export async function start() {
  await migrate()
  userManager.handler.start()
  createServer(1)

  const user = await auth.getUser(config.init.user)
  if (!user) {
    await auth.createUser(config.init.user, config.init.password)
    await userDomain.cmd.CreateUser(config.init.user, { isAdmin: true })
    logger.info({ user: config.init.user }, 'Created default user')
  }
}
