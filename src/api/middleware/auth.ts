import * as jwt from 'jsonwebtoken'
import { RequestHandler, Request } from 'express'
import { config } from 'src/env'
import { ServiceRequest, StatusError } from '../handle'

// One week
const SESSION_TIME = 1440 * 7 * 60 * 1000
export const sessionMiddleware: RequestHandler = (req, _, next) => {
  if (!req.user) return next()

  req.session.cookie.expires = new Date(Date.now() + SESSION_TIME)
  next()
}

export const authMiddleware: RequestHandler = async (req: ServiceRequest, _, next) => {
  const token = getToken(req)

  if (!req.session.user && !token) {
    return next(new StatusError('Not authorized', 401))
  }

  if (req.session.user) {
    req.user = req.session.user
    next()
  }

  if (token) {
    req.session.user = token
    req.session.save((err) => {
      if (err) return next(err)
      return next()
    })
  }

  next(new StatusError('Not authorized', 401))
}

export const adminMiddleware: RequestHandler = (req, _, next) => {
  const user = getToken(req)
  if (!user || user.isAdmin !== true) {
    return next(new StatusError('Not authorized', 401))
  }

  req.user = user
  next()
}

function getToken(req: Request) {
  const header = req.header('authorization')
  if (!header) {
    return null
  }

  if (!header.startsWith('Bearer ')) {
    return null
  }

  const token = header.replace('Bearer ', '')
  req.token = token
  try {
    const result: any = jwt.verify(token, config.jwtSecret)
    if (typeof result === 'string') {
      const user = JSON.parse(result)
      return user as AuthToken
    }

    return result as AuthToken
  } catch (err) {
    return null
  }
}
