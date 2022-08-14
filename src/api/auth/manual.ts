import { assertValid } from 'frisker'
import { auth } from 'src/db/auth'
import { handle, StatusError } from 'src/api/handle'

const Body = {
  username: 'string',
  password: 'string',
} as const

export const manual = handle(async (req, res) => {
  assertValid(Body, req.body)

  const user = await auth.getUser(req.body.username)
  if (!user) {
    throw new StatusError('Invalid username or password', 401)
  }

  const match = await auth.compare(req.body.password, user.hash)
  if (!match) {
    throw new StatusError('Invalid username or password', 401)
  }

  const { token, payload } = await auth.createToken({ userId: user.userId, username: user.username })

  req.session.userId = user.userId
  req.session.token = token
  req.session.auth = payload

  return res.json({ token: token, id: user.userId })
})
