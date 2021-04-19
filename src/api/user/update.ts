import { handle, StatusError } from 'svcready'
import { userDomain } from '../../domain/user'

type Body = {
  alias?: string
  email?: string
}

export const update = handle(async (req, res) => {
  const { alias, email }: Body = req.body
  if (!alias && !email) {
    throw new StatusError('No changes specified', 400)
  }

  const aggregateId = req.user!.userId
  if (alias) {
    await userDomain.cmd.UpdateAlias(aggregateId, { alias })
  }

  if (email) {
    await userDomain.cmd.UpdateEmail(aggregateId, { email })
  }

  res.json({ message: 'OK' })
})
