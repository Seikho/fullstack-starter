import * as jwt from 'jsonwebtoken'

const TOKEN_KEY = 'access_token'

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

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}
