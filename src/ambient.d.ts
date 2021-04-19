declare type AuthToken = BaseToken & {
  exp: number
  iat: number
}

declare type BaseToken = {
  type: string
  expires: number
  userId: string
  email?: string
  alias?: string
  isApiUser?: boolean
  isAdmin?: boolean
}
