import create, { UseBoundStore } from 'zustand'

type ReducerReturn<S> =
  | MaybeState<S>
  | Promise<MaybeState<S>>
  | AsyncGenerator<MaybeState<S>, MaybeState<S>>
  | Generator<MaybeState<S>, MaybeState<S>>

type MaybeState<S> = Partial<S> | void

export type Dispatcher<A extends { type: string }> = (action: A) => void

type ReducerBody<S, A extends { type: string }> = {
  [Type in A['type']]?: (state: S, action: Extract<A, { type: Type }>, dispatch: Dispatcher<A>) => ReducerReturn<S>
}

type InitAction = { type: '__INIT' }

type BaseAction<T extends { type: string }> = T | InitAction

type Setter<S> = (state: S) => void

const win: any = window
const devTools = win.__REDUX_DEVTOOLS_EXTENSION__?.connect?.() || { send: () => {} }

const stores: { [name: string]: UseBoundStore<any> } = {}

function send(name: string, action: any, state: any) {
  if (action.type === '__INIT') return
  let next: any = {}

  for (const [name, store] of Object.entries(stores)) {
    next[name] = store.getState()
  }

  next[name] = state
  devTools.send({ ...action, type: `${name}.${action.type}` }, next)
}

export function createStore<State, Action extends { type: string }>(
  name: string,
  init: State,
  handlers: ReducerBody<State, BaseAction<Action>>
) {
  const listeners: Array<{ type: string; callback: any }> = []
  const reducer = async (
    state: State = init,
    action: Action | InitAction,
    dispatch: Dispatcher<BaseAction<Action>>,
    setter: Setter<State>
  ) => {
    if (!action) return state

    const type = action.type as BaseAction<Action>['type']
    const handler = handlers[type]
    if (!handler) {
      return
    }

    const result = handler(state, action as any, dispatch)
    if (!result) return state

    if (isPromise<State>(result)) {
      const nextState = await result
      const next = { ...state, ...nextState }
      send(name, action, next)
      setter(next)
      return
    }

    if (isGenerator<State>(result)) {
      let next = { ...state }

      do {
        const { done, value: nextState } = await result.next()
        if (done === undefined) return
        if (!nextState) return
        next = { ...next, ...nextState }
        send(name, action, next)
        setter(next)
        if (done) return
      } while (true)
    }

    const next = { ...state, ...result }
    send(name, action, next)
    setter(next)
  }

  const store = create<State & { dispatch: Dispatcher<Action> }>((set, get) => {
    const dispatch = async (action: BaseAction<Action>) => {
      const next = await reducer(get(), action, dispatch, set)

      for (const listener of listeners) {
        if (listener.type === action.type) listener.callback(action)
      }

      return next
    }

    dispatch({ type: '__INIT' })

    return {
      ...init,
      dispatch,
    }
  })

  type PatchedStore = typeof store & {
    dispatch: Dispatcher<Action>
    listen: <T extends Action['type']>(type: T, callback: (action: Extract<Action, { type: T }>) => any) => void
  }

  const patchedStore = store as PatchedStore
  patchedStore.dispatch = store.getState().dispatch
  patchedStore.listen = (type, callback) => {
    listeners.push({ type, callback })
  }

  stores[name] = store

  send(name, { type: 'INIT' }, init)
  return patchedStore
}

function isPromise<S>(value: any): value is Promise<Partial<S> | void> {
  if (!value) return false
  return 'then' in value && typeof value.then === 'function'
}

function isGenerator<S>(
  value: any
): value is AsyncGenerator<Partial<S> | void, Partial<S> | void> | Generator<Partial<S>, Partial<S> | void> {
  if (!value) return false
  return 'next' in value && typeof value.next === 'function'
}
