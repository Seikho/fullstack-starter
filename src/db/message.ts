import { client } from './redis'
import { SocketApi } from 'src/ws/types'
import { createLogger } from 'svcready'

const logger = createLogger('sockets')

export interface Message {
  target: string | string[]
  type: string
  payload: any
}

export interface PublishOpts {
  target: string | string[]
  type: string
  payload: Omit<SocketApi, 'type'>
}

type MsgCallback = (msg: Message) => any

const callbacks: MsgCallback[] = []

export function subscribe(cb: MsgCallback) {
  callbacks.push(cb)
}

export async function publish(msg: PublishOpts) {
  try {
    await client.publish('messages', JSON.stringify(msg))
  } catch (err) {
    logger.error({ err }, 'Failed to write websocket message')
    // TODO: Retry logic?
  }
}

export async function initiate() {
  await client.connect()
  client.on('message', async (channel, message) => {
    logger.debug({ channel, message }, 'Message received')
    const payload = JSON.parse(message)

    const promises = callbacks.map((cb) => cb(payload))
    await Promise.all(promises)
  })
  logger.info('Connected to messages')
}
