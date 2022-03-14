import { createDomain } from 'evtstore'
import { getProvider } from '../util'
import { user } from './user'

export const { domain, createHandler } = createDomain({ provider: getProvider() }, { user })
