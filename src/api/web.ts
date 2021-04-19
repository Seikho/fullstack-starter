import * as path from 'path'
import { Router, static as toStatic } from 'express'

export { router as default }

const router = Router()

router.use('/', toStatic('dist'))

router.get('*', (req, res, next) => {
  const accept = req.header('accept')
  if (!accept || !accept.includes('text/html')) {
    return next()
  }

  res.sendFile('index.html', { root: path.join(process.cwd(), 'dist') })
})
