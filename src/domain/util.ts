import { db } from '../db/mongo'
import { Event } from 'evtstore'
import { createProvider } from 'evtstore/provider/mongo'
import { tables } from 'src/db/mongo'
import { logger } from 'svcready'

export async function getProvider<T extends Event = any>() {
  await db
  const provider = createProvider<T>({
    bookmarks: tables.bookmarks(),
    events: tables.events(),
    onError: (err, stream, bookmark) => logger.error({ err }, `Unhandled error in ${stream}:${bookmark}`),
  })

  return provider
}

export type DomainEvent<T extends string, U = {}> = { type: T } & U

export type DomainCmd<T extends string, U = {}> = { type: T } & U
