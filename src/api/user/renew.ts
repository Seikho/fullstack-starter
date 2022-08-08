import { handle, StatusError } from 'src/api/handle'
import { auth } from '../../db/auth'

export const renew = handle(async (req, res) => {
  const expires = req.session.cookie.expires
  if (!req.session.renew || !expires) {
    throw new StatusError('Foribdden', 403)
  }

  if (expires.valueOf() < Date.now()) {
    throw new StatusError('Foribdden', 403)
  }

  const user = req.user!
  const newToken = await auth.createToken({ userId: user.sub, username: user.sub })
  res.json(newToken)
})
