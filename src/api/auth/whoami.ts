import { wrap } from '../handle'

export const whoami = wrap((req) => {
  const session = req.session.user
  if (!session) return {}

  const { accessToken, refreshToken, ...user } = session
  return user
})
