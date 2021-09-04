declare type AuthToken = BaseToken & {
  type: 'webapp'
  exp: number
  iat: number
  accessToken?: string
  refreshToken?: string
  profile?: { id: string; displayName: string; name?: { givenName: string; familyName: string } }
}

declare type BaseToken = {
  type: string
  expires: number
  sub: string
  shortsub: string
  username: string
  email?: string
  alias?: string
  isApiUser?: boolean
  isAdmin?: boolean
}
