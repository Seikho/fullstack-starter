import * as React from 'react'
import { Navigate } from 'react-router-dom'
import { stores } from '../../state'

export const Success: React.FC = () => {
  const dispatch = stores.user((store) => store.dispatch)
  const search = parseSearch()
  if (search.accessToken) {
    dispatch({ type: 'RECEIVE_LOGIN', token: search.accessToken })
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
