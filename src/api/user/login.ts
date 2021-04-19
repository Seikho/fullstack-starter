import { handle, StatusError } from 'svcready'
import { auth } from '../../db/auth'

type Body = {
  username: string
  password: string
}

export const login = handle(async (req, res) => {
  const { username, password }: Body = req.body
  if (!username || !password) {
    throw new StatusError('Username or password not specified', 400)
  }

  const badLogin = new StatusError('Invalid username or password', 401)
  const lowered = username.toLowerCase()
  const user = await auth.getUser(lowered)
  if (!user) {
    throw badLogin
  }

  const isCorrect = await auth.compare(password, user.hash)
  if (!isCorrect) {
    throw badLogin
  }

  const token = await auth.createToken(lowered)
  res.json(token)
})
