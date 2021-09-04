import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import { getDb } from './event'
import { config } from '../env'
import { userManager } from '../manager/user'
import { CommandError } from 'evtstore'
import { v4 } from 'uuid'

type Auth = {
  userId: string
  username: string
  hash: string
}
const table = () => getDb().collection<Auth>('auth')

async function createUser(username: string, password: string) {
  const userId = v4()
  const user = await table().findOne({ username })
  if (user) {
    throw new CommandError('User already exists', 'USER_EXISTS')
  }

  const hash = await encrypt(password)
  await table().insertOne({ userId, username, hash })
  await userManager.store.createUser({
    userId,
    alias: '',
    email: '',
    isAdmin: false,
  })
  return userId
}

async function getUser(username: string) {
  const user = await table().findOne({ username: username.toLowerCase() })
  return user
}

const salt = getSalt()

async function encrypt(value: string) {
  const hashed = await bcrypt.hash(value, await salt)
  return hashed
}

async function compare(input: string, hashed: string) {
  const result = await bcrypt.compare(input, hashed)
  return result
}

async function getSalt() {
  const salt = await bcrypt.genSalt(10)
  return salt
}

const ONE_HOUR_MS = 1000 * 60 * 60
async function createToken(user: Omit<Auth, 'hash'>) {
  const expires = Date.now() + ONE_HOUR_MS * config.jwtExpiry
  const profile = await userManager.store.getUser(user.userId)

  if (!profile) {
    throw new Error('User not found')
  }

  const payload: BaseToken = {
    type: 'webapp',
    expires,
    sub: user.userId,
    shortsub: user.userId.slice(0, 8),
    ...(profile || {}),
    username: user.username,
  }

  const expiresIn = (ONE_HOUR_MS * config.jwtExpiry) / 1000
  const token = jwt.sign(payload, config.jwtSecret, { expiresIn })
  return { token, payload }
}

export const auth = {
  createUser,
  createToken,
  getUser,
  compare,
}
