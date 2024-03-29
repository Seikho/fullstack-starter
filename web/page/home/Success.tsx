import * as React from 'react'
import { Navigate } from 'react-router-dom'
import { userStore } from '../../state'

export const Success: React.FC = () => {
  const search = parseSearch()
  if (search.accessToken) {
    userStore.dispatch({ type: 'RECEIVE_LOGIN', token: search.accessToken })
  }

  return <Navigate to="/" />
}

function parseSearch() {
  const search = location.search
  const map = search
    .slice(1)
    .split('&')
    .map((pair) => pair.split('='))
    .reduce<any>((prev, [key, value]) => ({ ...prev, [key]: value }), {})

  return map
}
