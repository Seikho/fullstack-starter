import * as React from 'react'
import { withDispatch } from '../state/store'

export const Logout: React.FC = withDispatch(({ dispatch }) => {
  React.useEffect(() => {
    console.log('logging out')
    dispatch({ type: 'USER_REQUEST_LOGOUT' })
  }, [])

  return <div>Logging out...</div>
})
