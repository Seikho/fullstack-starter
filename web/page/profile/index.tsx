import * as React from 'react'
import { userStore } from '/web/state'

export const Profile = () => {
  const user = userStore((u) => u.user)!

  React.useEffect(() => {
    userStore.dispatch({ type: 'WHOAMI' })
  }, [])

  return (
    <div>
      <h3>Profile</h3>
      <h4>{user.alias || user.username}</h4>
    </div>
  )
}
