import { db } from 'src/db/event'
import { UserProfile } from 'src/domain/types/user'

const coll = db.then((tbl) => tbl.collection<UserProfile>('userProfiles'))

export async function getUser(userId: string) {
  const loweredId = userId.toLowerCase()
  return coll.then((coll) => coll.findOne({ userId: loweredId }))
}

export async function setUser(userId: string, profile: Partial<UserProfile>) {
  if (profile.userId) {
    throw new Error('Cannot change userId')
  }

  return coll.then((coll) => coll.updateOne({ userId }, { $set: profile }))
}

export async function createUser(profile: UserProfile) {
  return coll.then((coll) => coll.insertOne(profile))
}
