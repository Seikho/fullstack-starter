import * as jwt from 'jsonwebtoken'
import { createReducer } from 'typedstate'

export { reducer }

type UserState = {
  alias?: string
  email?: string
  token?: string
  userId: string
  loggedIn: boolean
  loginError?: string
  isAdmin: boolean
  menu: boolean
}

type UserAction =
  | { type: 'NAVIGATE'; to: any }
  | { type: 'APP_INIT' }
  | {
      type: 'USER_UPDATE'
      alias?: string
      email?: string
      token?: string
      userId?: string
      loggedIn?: boolean
      isAdmin?: boolean
    }
  | { type: 'USER_REQUEST_LOGIN'; username: string; password: string }
  | { type: 'USER_RECEIVE_LOGIN'; token?: string; error?: string }
  | { type: 'USER_REQUEST_REGISTER'; username: string; password: string; confirm: string }
  | { type: 'USER_RECEIVE_REGISTER'; token?: string; error?: string }
  | { type: 'USER_REQUEST_LOGOUT' }
  | { type: 'USER_TOGGLE_MENU' }

const TOKEN_KEY = 'access_token'

const token = getParsedToken()
const now = Date.now() / 1000
const tokenValid = token ? token.exp > now : false

const { reducer, handle } = createReducer<UserState, UserAction>({
  loggedIn: tokenValid,
  userId: token?.userId ?? '',
  isAdmin: false,
  menu: false,
})

handle('USER_REQUEST_LOGIN', {
  loginError: undefined,
})

handle('USER_TOGGLE_MENU', ({ menu }) => ({ menu: !menu }))

handle('USER_RECEIVE_LOGIN', (_, { token, error }) => {
  if (error) {
    return { loginError: error }
  }

  if (token) {
    const payload = parseToken(token)
    if (payload.type !== 'webapp') return {}

    return {
      token,
      loggedIn: true,
      alias: payload.alias,
      userId: payload.userId,
      email: payload.email,
      isAdmin: payload.isAdmin ?? false,
    }
  }
})

handle('USER_REQUEST_LOGOUT', () => {
  localStorage.removeItem(TOKEN_KEY)
  return {
    loggedIn: false,
    token: undefined,
    userId: undefined,
    email: undefined,
    alias: undefined,
  }
})

export function parseToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
  const payload = jwt.decode(token) as AuthToken
  return payload
}

export function hydrateToken() {
  const token = localStorage.getItem(TOKEN_KEY)
  return token
}

export function getParsedToken() {
  const token = localStorage.getItem(TOKEN_KEY)
  if (!token) return

  const payload = jwt.decode(token) as AuthToken
  return payload
}
