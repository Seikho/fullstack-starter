import * as React from 'react'
import { stores } from '../../state'
import { Guest } from './Guest'
import { User } from './User'

export const Home: React.FC = () => {
  const loggedIn = stores.user((store) => store.loggedIn)
  const Body = loggedIn ? User : Guest
  return <Body />
}
