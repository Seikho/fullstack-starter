import * as React from 'react'
import { Redirect } from 'react-router-dom'
import { withState } from '/web/store'

export const Success: React.FC<{}> = withState(
  () => ({}),
  ({ dispatch }) => {
    const search = parseSearch()
    if (search.accessToken) {
      dispatch({ type: 'USER_RECEIVE_LOGIN', token: search.accessToken })
    }

    return <Redirect to="/" />
  }
)

function parseSearch() {
  const search = location.search
  const map = search
    .slice(1)
    .split('&')
    .map((pair) => pair.split('='))
    .reduce<any>((prev, [key, value]) => ({ ...prev, [key]: value }), {})

  return map
}
