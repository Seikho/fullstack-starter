import * as React from 'react'
import { withDispatch } from '../state/store'

export const Logout: React.FC = withDispatch(({ dispatch }) => {
  React.useEffect(() => {
    dispatch({ type: 'USER_REQUEST_LOGOUT' })
  }, [])

  return <div>Logging out...</div>
})
