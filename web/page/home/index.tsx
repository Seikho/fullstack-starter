import * as React from 'react'
import { withState } from '../../state'
import { Guest } from './Guest'

export const Home = withState(
  ({ user }) => ({ user }),
  ({ user }) => {
    const Body = user.loggedIn ? HelloWorld : Guest
    return <Body />
  }
)

const HelloWorld: React.FC = () => <div>Hello World!</div>
