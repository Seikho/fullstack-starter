import { table } from '../db/event'
import { Event } from 'evtstore'
import { createProvider } from 'evtstore/provider/mongo'
import { logger } from '../logger'

export async function getProvider<T extends Event>() {
  const provider = createProvider<T>({
    bookmarks: table.bookmarks,
    events: table.events,
    onError: (err, stream, bookmark) =>
      logger.error({ err }, `Unhandled error in ${stream}:${bookmark}`),
  })

  return provider
}

export type DomainEvent<T extends string, U = {}> = { type: T } & U

export type DomainCmd<T extends string, U = {}> = { type: T } & U
