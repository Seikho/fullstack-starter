import { createReducer } from '../create'

export { reducer }

export type Toast = {
  type?: 'default' | 'info' | 'warn' | 'success' | 'error' | 'naked'
  message?: string
  title?: string
}

type ToastType = Toast['type']

type ToastAction =
  | { type: 'TOAST_ADD'; kind: ToastType; message?: string; title?: string; ttl?: number }
  | {
      type: 'TOAST_ADDED'
      id: number
      kind: ToastType
      message?: string
      title?: string
      ttl?: number
    }
  | { type: 'TOAST_REMOVE'; id: number }

export type ToastState = {
  toasts: Array<Toast & { id: number; ttl: Date }>
}

const { reducer, handle } = createReducer<ToastState, ToastAction>({ toasts: [] })

handle('TOAST_ADDED', ({ toasts }, action) => {
  const ttl = action.ttl ?? 8
  return {
    toasts: toasts.concat({
      id: action.id,
      type: action.kind ?? 'default',
      message: action.message,
      title: action.title,
      ttl: new Date(Date.now() + ttl * 1000),
    }),
  }
})

handle('TOAST_REMOVE', ({ toasts }, { id }) => {
  return {
    toasts: toasts.filter((toast) => toast.id !== id),
  }
})
