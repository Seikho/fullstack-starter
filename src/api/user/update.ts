import { userCmd } from 'src/domain/cmd/user'
import { handle, StatusError } from 'svcready'

type Body = {
  alias?: string
  email?: string
}

export const update = handle(async (req, res) => {
  const { alias, email }: Body = req.body
  if (!alias && !email) {
    throw new StatusError('No changes specified', 400)
  }

  const aggregateId = req.user!.sub
  if (alias) {
    await userCmd.UpdateAlias(aggregateId, { alias })
  }

  if (email) {
    await userCmd.UpdateEmail(aggregateId, { email })
  }

  res.json({ message: 'OK' })
})
