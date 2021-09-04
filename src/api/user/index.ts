import { Router } from 'express'
import { update } from './update'
import { renew } from './renew'
import { middleware } from '../middleware'

export { router as default }

const router = Router()

router.post('/renew', middleware.auth, renew)
router.post('/', middleware.auth, update)
