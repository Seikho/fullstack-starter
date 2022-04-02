import { tables } from 'src/db/mongo'
import { UserProfile } from 'src/db/schema'

export async function getUser(userId: string) {
  const loweredId = userId.toLowerCase()
  return tables.userProfiles().findOne({ userId: loweredId })
}

export async function setUser(userId: string, profile: Partial<UserProfile>) {
  if (profile.userId) {
    throw new Error('Cannot change userId')
  }

  return tables.userProfiles().updateOne({ userId }, { $set: profile })
}

export async function createUser(profile: UserProfile) {
  return tables.userProfiles().insertOne(profile)
}
