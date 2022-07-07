import { config } from './config'
import { hydrateToken } from './util'

const baseUrl = config.apiUrl

export const api = {
  get,
  post,
}

type Query = { [key: string]: string | number }

async function get<T = any>(path: string, query: Query = {}) {
  const params = Object.keys(query)
    .map((key) => `${key}=${query[key]}`)
    .join('&')

  return callApi<T>(`${path}?${params}`, {
    method: 'get',
  })
}

async function post<T = any>(path: string, body = {}) {
  return callApi<T>(path, {
    method: 'post',
    body: JSON.stringify(body),
  })
}

async function callApi<T = any>(
  path: string,
  opts: RequestInit
): Promise<{ result: T | undefined; status: number; error?: string }> {
  const prefix = path.startsWith('/') ? '/api' : '/api'
  const res = await fetch(`${baseUrl}${prefix}${path}`, { ...opts, ...headers() })
  const json = await res.json()

  if (res.status === 401) {
    if (path.endsWith('/login')) {
      return { result: undefined, status: 401, error: 'Unauthorized' }
    }

    if (path.endsWith('/renew')) {
      // store.dispatch({ type: 'USER_REQUEST_LOGOUT' })
      throw new StatusError('Unauthorized', 401)
    }

    // The API returns 'false' if the token is still valid
    const { result, status } = await callApi<string | false>('/user/renew', { method: 'post' })

    if (status !== 200) {
      throw new StatusError('Unauthorized', 401)
    }

    // If we received a 401 and renewed successfully, it was unrelated to authentication
    if (result === false) {
      return { result: undefined, status: 401, error: 'Not authorized' }
    }

    // store.dispatch({ type: 'USER_RECEIVE_LOGIN', token: result })
    return callApi(path, opts)
  }

  if (res.status >= 400) {
    return { result: undefined, status: res.status, error: json.message || res.statusText }
  }

  return { result: json, status: res.status, error: res.status >= 400 ? res.statusText : undefined }
}

class StatusError extends Error {
  constructor(public msg: string, public status: number) {
    super(msg)
  }
}

function headers() {
  const headers: any = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }

  const token = hydrateToken()
  if (!token) return { headers }

  headers.Authorization = `Bearer ${token}`
  return { headers }
}

// setInterval(async () => {
//   const { user } = store.getState()
//   if (user.token) {
//     const { result } = await callApi<string | false>('/user/renew', {
//       method: 'post',
//     })

//     if (result !== false) {
//       store.dispatch({ type: 'USER_RECEIVE_LOGIN', token: result })
//     }
//   }
// }, 1800000)
