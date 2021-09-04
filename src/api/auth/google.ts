import * as G from 'passport-google-oauth20'
import * as passport from 'passport'
import { config } from 'src/env'

const [id, secret] = config.auth.google.split(',')
const valid = !!id && !!secret

if (valid) {
  passport.use(
    new G.Strategy(
      {
        clientID: id,
        clientSecret: secret,
        callbackURL: `${config.baseUrl}/api/auth/google/callback`,
      },
      (accessToken, refreshToken, profile, done) => {
        done(null, { accessToken, refreshToken, profile })
      }
    )
  )
}

export const google = valid
  ? passport.authenticate('google', { accessType: 'offline', scope: ['profile'] })
  : null
