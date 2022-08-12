import { createStore } from '../create'

export type Toast = {
  type?: ToastType
  message?: string
  title?: string
}

type ToastType = 'default' | 'info' | 'warn' | 'success' | 'error' | 'naked'

export type ToastState = {
  toasts: Array<Toast & { id: number }>
}

let toastId = 0

export const toastStore = createStore<ToastState>('toast', { toasts: [] })((get, set) => {
  const add = async function* (type: ToastType, message: string, title?: string) {
    let id = ++toastId
    const next = get().toasts.concat({ id, type, message, title })
    yield { toasts: next }

    setTimeout(() => {
      const next = get().toasts.filter((t) => t.id !== id)
      set({ toasts: next })
    }, 8000)
  }

  return {
    add: (_, kind: ToastType, message: string, title?: string) => add(kind, message, title),
    info: (_, message: string, title?: string) => add('info', message, title),
    warn: (_, message: string, title?: string) => add('warn', message, title),
    success: (_, message: string, title?: string) => add('success', message, title),
    error: (_, message: string, title?: string) => add('error', message, title),
  }
})
