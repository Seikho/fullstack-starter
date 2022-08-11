import * as React from 'react'
import { userStore } from '../state'

export const Logout: React.FC = () => {
  React.useEffect(() => {
    userStore.dispatch({ type: 'REQUEST_LOGOUT' })
  }, [])

  return <div>Logging out...</div>
}
