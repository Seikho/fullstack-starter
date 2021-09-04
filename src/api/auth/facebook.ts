import * as FB from 'passport-facebook'
import * as passport from 'passport'
import { config } from 'src/env'

const [id, secret] = config.auth.facebook.split(',')
const valid = !!id && !!secret

if (valid) {
  passport.use(
    new FB.Strategy(
      {
        clientID: id,
        clientSecret: secret,
        callbackURL: `${config.baseUrl}/api/auth/facebook/callback`,
        profileFields: ['id', 'name'],
        display: 'page',
        authType: 'reauthenticate',
      },
      (accessToken, refreshToken, profile, done) => {
        done(null, { accessToken, refreshToken, profile })
      }
    )
  )
}

export const facebook = valid ? passport.authenticate('facebook', {}) : null
