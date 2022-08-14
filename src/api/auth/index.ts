import './google'
import './facebook'
import passport from 'passport'
import { Router } from 'express'
import { callback } from './callback'
import { logger } from 'src/logger'
import { facebook } from './facebook'
import { google } from './google'
import { manual } from './manual'
import { logout } from './logout'
import { whoami } from './whoami'

export { router as default }

const router = Router()

passport.serializeUser((user, done) => {
  logger.warn({ user }, 'serialize')
  done(null, {})
})

passport.deserializeUser((id, done) => {
  logger.warn({ id }, 'deserialize')
  done(null)
})

router.use(passport.initialize() as any)

if (google) router.get('/google', google)
if (facebook) router.get('/facebook', facebook)

router.post('/login', manual)
router.post('/logout', logout)
router.get('/whoami', whoami)
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login-failed' }), callback)
router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login-failed' }), callback)
