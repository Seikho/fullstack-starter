import * as fs from 'fs'
import { v4 } from 'uuid'

if (!process.env.JWT_SECRET) getSecretFromFile()

export const config = {
  appEnv: getEnv('APP_ENV', 'dev'),
  logLevel: getEnv('LOG_LEVEL', 'info'),
  baseUrl: getEnv('BASE_URL', 'http://localhost:3001'),
  port: Number(getEnv('PORT', '3001')),
  auth: {
    facebook: getEnv('FACEBOOK', ''),
    google: getEnv('GOOGLE', ''),
  },
  db: {
    host: getEnv('DB_HOST', 'localhost:27020'),
    database: getEnv('DB_DATABASE', 'webapp'),
    events: getEnv('DB_EVENTS', 'events'),
    bookmarks: getEnv('DB_BOOKMARKS', 'bookmarks'),
    user: getEnv('DB_USER', 'root'),
    password: getEnv('DB_PASS', 'password'),
  },
  redis: {
    host: getEnv('REDIS_HOST', '127.0.0.1'),
    port: Number(getEnv('REDIS_PORT', '6378')),
    user: getEnv('REDIS_USER', ''),
    password: getEnv('REDIS_PASSWORD', ''),
  },
  jwtSecret: getEnv('JWT_SECRET', 'exam'),
  jwtExpiry: Number(getEnv('JWT_EXPIRY', '24')),
  mail: {
    enabled: !!process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY,
    domain: getEnv('MAIL_DOMAIN', 'webapp.example-tld'),
  },
  init: {
    user: getEnv('INIT_USER', 'admin'),
    password: getEnv('INIT_PASS', 'admin'),
  },
}

function getEnv(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback
  if (value === undefined) throw new Error(`Missing environment variable: "${key}"`)
  return value
}

function getSecretFromFile() {
  const file = '.secret'
  try {
    fs.statSync(file)
    const secret = fs.readFileSync(file)
    process.env.JWT_SECRET = secret.toString()
  } catch (ex) {
    const secret = v4()
    fs.writeFileSync(file, secret)
    process.env.JWT_SECRET = secret
  }
}
