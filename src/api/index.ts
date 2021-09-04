import { Router } from 'express'
import auth from './auth'
import user from './user'

export { router as default }

const router = Router()

router.use('/auth', auth)
router.use('/user', user)
