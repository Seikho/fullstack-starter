import * as React from 'react'
import { stores } from '../state'

export const Logout: React.FC = () => {
  const dispatch = stores.user((store) => store.dispatch)
  React.useEffect(() => {
    dispatch({ type: 'REQUEST_LOGOUT' })
  }, [])

  return <div>Logging out...</div>
}
