import { handle, StatusError } from 'svcready'
import { auth } from '../../db/auth'

export const renew = handle(async (req, res) => {
  const user = req.user!

  const diff = user.expires - Date.now()
  const minutes = (diff * 0.001) / 60

  if (minutes > 10) {
    return res.json(false)
  }

  if (minutes < -10) {
    throw new StatusError('Unauthorized', 401)
  }

  const newToken = await auth.createToken(user.userId)
  res.json(newToken)
})
