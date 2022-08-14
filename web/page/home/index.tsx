import * as React from 'react'
import { Navigate } from 'react-router-dom'
import { userStore } from '../../state'
import { Guest } from './Guest'
import { User } from './User'

export const Home: React.FC = () => {
  const { loggedIn, url, loading } = userStore((u) => ({
    loggedIn: u.loggedIn,
    url: u.initialUrl,
    loading: u.loginLoading,
  }))

  if (loading) return <div>Loading...</div>

  if (loggedIn) {
    if (url) {
      userStore.dispatch({ type: 'CLEAR_URL' })
      return <Navigate to={url} />
    }

    return <User />
  }
  return <Guest />
}
