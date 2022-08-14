import { api } from '../api'
import { createReducerStore } from '../create'
import { toastStore } from '../toast'
import { parseToken, clearToken } from '../util'

type UserState = {
  initialUrl?: string
  loginLoading: boolean
  loggedIn: boolean
  loginError?: string
  registerError?: string
  isAdmin: boolean
  menu: boolean
  user?: AuthToken
}

type UserAction =
  | { type: 'NAVIGATE'; to: any }
  | { type: 'APP_INIT' }
  | {
      type: 'UPDATE'
      alias?: string
      email?: string
      token?: string
      userId?: string
      loggedIn?: boolean
      isAdmin?: boolean
    }
  | { type: 'REQUEST_LOGIN'; username: string; password: string }
  | { type: 'RECEIVE_LOGIN'; token: string }
  | { type: 'REQUEST_REGISTER'; username: string; password: string; confirm: string }
  | { type: 'REQUEST_LOGOUT' }
  | { type: 'TOGGLE_MENU' }
  | { type: 'CLEAR_URL' }
  | { type: 'WHOAMI' }

export const userStore = createReducerStore<UserState, UserAction>(
  'user',
  {
    initialUrl: location.pathname === '/' ? '' : location.pathname,
    loginLoading: true,
    loggedIn: false,
    isAdmin: false,
    menu: false,
  },
  {
    __INIT: (_, __, dispatch) => {
      dispatch({ type: 'WHOAMI' })
    },
    CLEAR_URL: async () => ({ initialUrl: '' }),
    WHOAMI: async function* () {
      const { error, result } = await api.get<AuthToken>('/auth/whoami')
      yield { loginLoading: false }

      if (error || !result?.sub) {
        return { initialUrl: '' }
      }

      return {
        loginLoading: false,
        loggedIn: true,
        user: result,
      }
    },
    REQUEST_LOGIN: async function* (_, { username, password }) {
      yield { loginLoading: true }
      const { result, error } = await api.post('/auth/login', { username, password })
      yield { loginLoading: false }
      if (error) return { loginError: error }

      return { loggedIn: true, user: result.user }
    },
    RECEIVE_LOGIN: (_, { token }) => {
      if (!token) return
      const payload = parseToken(token)
      if (payload.type !== 'webapp') return { loginLoading: false }

      toastStore.info('Successfully logged in')

      return {
        loginLoading: false,
        loggedIn: true,
        user: payload,
      }
    },
    REQUEST_REGISTER: async (_, { username, password, confirm }, dispatch) => {
      if (password !== confirm) return
      const { result, error } = await api.post('/user/register', { username, password, confirm })
      if (error) return { registerError: error }

      const payload = parseToken(result)
      if (payload.type !== 'webapp') return {}

      dispatch({ type: 'RECEIVE_LOGIN', token: result })
    },
    TOGGLE_MENU: ({ menu }) => ({ menu: !menu }),
    REQUEST_LOGOUT: async function* () {
      await api.post('/auth/logout')
      clearToken()

      toastStore.info('Successfully logged out')

      return {
        loggedIn: false,
        user: undefined,
      }
    },
  }
)
