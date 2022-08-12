import * as React from 'react'
import { userStore } from '../../state'
import { Guest } from './Guest'
import { User } from './User'

export const Home: React.FC = () => {
  const loggedIn = userStore((store) => store.loggedIn)
  if (loggedIn) return <User />
  return <Guest />
}
