import { createStore } from '../create'

export type Toast = {
  type?: 'default' | 'info' | 'warn' | 'success' | 'error' | 'naked'
  message?: string
  title?: string
}

type ToastType = Toast['type']

type ToastAction =
  | { type: 'ADD'; kind: ToastType; message?: string; title?: string; ttl?: number }
  | { type: 'REMOVE'; id: number }

export type ToastState = {
  toasts: Array<Toast & { id: number; ttl: Date }>
}

let toastId = 0
export const toastStore = createStore<ToastState, ToastAction>(
  'toast',
  { toasts: [] },
  {
    ADD: ({ toasts }, action, dispatch) => {
      let nextId = ++toastId
      const ttl = action.ttl ?? 8

      setTimeout(() => {
        dispatch({ type: 'REMOVE', id: nextId })
      }, ttl * 1000)

      return {
        toasts: toasts.concat({
          id: nextId,
          type: action.kind ?? 'default',
          message: action.message,
          title: action.title,
          ttl: new Date(Date.now() + ttl * 1000),
        }),
      }
    },
    REMOVE: ({ toasts }, { id }) => {
      return { toasts: toasts.filter((t) => t.id !== id) }
    },
  }
)
