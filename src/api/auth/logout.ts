import { wrap } from '../handle'

export const logout = wrap((req, res, next) => {
  req.session.user = null
  req.session.save((err) => {
    if (err) return next(err)

    res.json({ success: true })
  })
})
