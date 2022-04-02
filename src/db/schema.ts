export type Auth = {
  userId: string
  username: string
  hash: string
}

export interface UserProfile {
  userId: string
  alias?: string
  email?: string
  isAdmin?: boolean
}
