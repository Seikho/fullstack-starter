import { handle, StatusError } from 'svcready'
import { auth } from 'src/db/auth'
import { userCmd } from 'src/domain/cmd/user'

export const callback = handle(async (req, res) => {
  if (!req.user) throw new StatusError('Unauthorized', 401)

  if (req.user.type === 'webapp') {
    return res.redirect('/')
  }

  if (!req.user.accessToken || !req.user.profile) {
    throw new StatusError('Unauthorized', 401)
  }

  const profileId = req.user.profile.id
  let user = await auth.getUser(profileId)

  // If we didn't find a user, they're a new user
  // Create a new account and profile
  if (!user) {
    const userId = await auth.createUser(profileId, '')
    await userCmd.CreateUser(userId, {
      username: profileId,
      isAdmin: false,
    })

    user = {
      userId,
      username: profileId,
      hash: '',
    }
  }

  const { token } = await auth.createToken({
    userId: user.userId,
    username: profileId,
  })

  req.session.userId = user.userId

  req.token = req.user.refreshToken
  return res.redirect(`/success?accessToken=${token}&id=${user.userId}`)
})
