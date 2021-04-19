import * as dotenv from 'dotenv'

dotenv.config()

export const config = {
  appEnv: getEnv('APP_ENV', 'dev'),
  logLevel: getEnv('LOG_LEVEL', 'info'),
  port: Number(getEnv('PORT', '3000')),
  db: {
    host: getEnv('DB_HOST', 'localhost:27018'),
    database: getEnv('DB_DATABASE', 'webapp'),
    events: getEnv('DB_EVENTS', 'events'),
    bookmarks: getEnv('DB_BOOKMARKS', 'bookmarks'),
    user: getEnv('DB_USER', 'root'),
    password: getEnv('DB_PASS', 'password'),
  },
  jwtSecret: getEnv('JWT_SECRET'),
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
  if (!value) throw new Error(`Missing environment variable: "${key}"`)
  return value
}
