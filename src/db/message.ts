import { Timestamp, ChangeStream } from 'mongodb'
import { createLogger } from '../logger'
import { db } from './event'

const logger = createLogger('sockets')

export interface Message {
  timestamp: Timestamp
  expireAt: Date

  target: string
  type: string
  payload: any
}

export interface PublishOpts {
  target: string
  type: string
  payload: any
}

const collection = db.then((coll) => coll.collection<Message>('messages'))

type MsgCallback = (msg: Message) => any

const callbacks: MsgCallback[] = []

export function subscribe(cb: MsgCallback) {
  callbacks.push(cb)
}

export async function publish(msg: PublishOpts) {
  try {
    const expireAt = new Date()
    expireAt.setSeconds(expireAt.getSeconds() + 5)
    const timestamp = new Timestamp(0, 0)

    await collection.then((cb) => cb.insertOne({ ...msg, timestamp, expireAt }))
  } catch (err) {
    logger.error({ err }, 'Failed to write websocket message')
    // TODO: Retry logic?
  }
}

export async function initiate() {
  const initStream = await getStream()
  loop(initStream)
}

async function getStream() {
  const stream = await collection.then((coll) =>
    coll.watch([{ $match: { operationType: 'insert' } }])
  )

  logger.info('Websocket change stream established')
  return stream
}

async function loop(stream?: ChangeStream) {
  const changeStream = stream || (await getStream())

  try {
    while (true) {
      const msg = await changeStream.next()
      if (msg) {
        dispatchMessage(msg.fullDocument)
      }
    }
  } catch (err) {
    logger.warn({ err }, 'Unexpected error in websocket change stream')
  }

  await sleep()
  loop()
}

function sleep() {
  return new Promise((resolve) => setTimeout(resolve, 1000))
}

async function dispatchMessage(msg: Message) {
  const promises: Promise<any>[] = []
  for (const cb of callbacks) {
    promises.push(cb(msg))
  }

  await Promise.all(promises)
}
