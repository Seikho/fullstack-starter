import { saga } from '../store'
import { hydrateToken } from '.'
import { api } from '../api'

saga('APP_INIT', (_, dispatch) => {
  const token = hydrateToken()
  if (!token) return

  dispatch({ type: 'USER_RECEIVE_LOGIN', token })
})

saga('USER_REQUEST_LOGIN', async ({ username, password }, dispatch) => {
  const { result, error } = await api.post('/auth/login', { username, password })
  console.log(result, error)
  if (error) {
    dispatch({ type: 'USER_RECEIVE_LOGIN', error })
    dispatch({ type: 'TOAST_ADD', kind: 'error', message: 'Failed to login' })
    return
  }

  dispatch({ type: 'USER_RECEIVE_LOGIN', token: result.token })
})

saga('USER_REQUEST_REGISTER', async ({ username, password, confirm }, dispatch) => {
  if (password !== confirm) return

  const { result, error } = await api.post('/user/register', { username, password, confirm })

  if (error) {
    dispatch({ type: 'USER_RECEIVE_REGISTER', error })
    return
  }

  dispatch({ type: 'USER_RECEIVE_REGISTER', token: result })
})

saga('USER_RECEIVE_REGISTER', ({ token, error }, dispatch) => {
  if (error) {
    dispatch({ type: 'TOAST_ADD', kind: 'error', message: error })
    return
  }

  if (!token) return
  dispatch({ type: 'USER_RECEIVE_LOGIN', token })
})

saga('USER_RECEIVE_LOGIN', (action, dispatch) => {
  if (action.token) {
    dispatch({ type: 'SOCKET_LOGIN', token: action.token })
  }

  if (action.error) {
    dispatch({ type: 'TOAST_ADD', kind: 'error', message: `Failed to login: ${action.error}` })
  }
})
