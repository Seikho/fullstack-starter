import * as React from 'react'
import { withState } from '../../state'
import { Guest } from './Guest'
import { User } from './User'

export const Home = withState(
  ({ user }) => ({ user }),
  ({ user }) => {
    const Body = user.loggedIn ? User : Guest
    return <Body />
  }
)
