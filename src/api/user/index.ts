import { Router } from 'express'
import { register } from './register'
import { login } from './login'
import { update } from './update'
import { renew } from './renew'
import { middleware } from '../middleware'

export { router as default }

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.post('/renew', middleware.auth, renew)
router.post('/', middleware.auth, update)
