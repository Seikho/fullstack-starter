import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import { db } from './event'
import { config } from '../env'
import { userManager } from '../manager/user'

type Auth = {
  username: string
  hash: string
}

const table = db.then((db) => db.collection<Auth>('auth'))

async function createUser(username: string, password: string) {
  const user = await table.then((coll) => coll.findOne({ username }))
  if (user) {
    throw new Error('User already exists')
  }

  const hash = await encrypt(password)
  await table.then((coll) => coll.insertOne({ username, hash }))
}

async function getUser(username: string) {
  const user = await table.then((coll) => coll.findOne({ username }))
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
async function createToken(userId: string) {
  const expires = Date.now() + ONE_HOUR_MS * config.jwtExpiry
  const profile = await userManager.store.getUser(userId)
  const user = await getUser(userId)

  if (!user && !profile) {
    throw new Error('User not found')
  }

  const payload: BaseToken = {
    type: 'webapp',
    expires,
    userId,
    ...(profile || {}),
  }

  const expiresIn = (ONE_HOUR_MS * config.jwtExpiry) / 1000
  const token = jwt.sign(payload, config.jwtSecret, { expiresIn })
  return token
}

export const auth = {
  createUser,
  createToken,
  getUser,
  compare,
}
