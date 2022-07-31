import { api } from '../api'
import { createStore } from '../create'
import { getParsedToken, parseToken } from '../util'

type UserState = {
  loginLoading: boolean
  alias?: string
  email?: string
  token?: string
  userId: string
  loggedIn: boolean
  loginError?: string
  registerError?: string
  isAdmin: boolean
  menu: boolean
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

const token = getParsedToken()
const now = Date.now() / 1000
const tokenValid = token ? token.exp > now : false

export const userStore = createStore<UserState, UserAction>(
  'user',
  {
    loginLoading: false,
    loggedIn: tokenValid,
    userId: token?.sub ?? '',
    isAdmin: false,
    menu: false,
  },
  {
    REQUEST_LOGIN: async function* (_, { username, password }, dispatch) {
      yield { loginLoading: true }
      const { result, error } = await api.post('/auth/login', { username, password })
      if (error) return { loginLoading: false, loginError: error }

      dispatch({ type: 'RECEIVE_LOGIN', token: result.token })
    },
    RECEIVE_LOGIN: (_, { token }) => {
      const payload = parseToken(token)
      if (payload.type !== 'webapp') return { loginLoading: false }

      return {
        token,
        loginLoading: false,
        loggedIn: true,
        alias: payload.alias,
        userId: payload.sub,
        email: payload.email,
        isAdmin: payload.isAdmin ?? false,
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
    REQUEST_LOGOUT: () => ({
      loggedIn: false,
      token: undefined,
      userId: undefined,
      email: undefined,
      alias: undefined,
    }),
  }
)
