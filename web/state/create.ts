import create, { UseBoundStore } from 'zustand'

type ReducerReturn<S> =
  | Promise<Partial<S> | void>
  | Partial<S>
  | void
  | AsyncIterator<Partial<S> | void>
  | Iterator<Partial<S> | void>
export type Dispatcher<S, A extends { type: string }> = (action: A) => ReducerReturn<S>

type ReducerBody<S, A extends { type: string }> = {
  [Type in A['type']]?: (state: S, action: Extract<A, { type: Type }>, dispatch: Dispatcher<S, A>) => ReducerReturn<S>
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
  const reducer = async (
    state: State = init,
    action: Action | InitAction,
    dispatch: Dispatcher<State, BaseAction<Action>>,
    setter: Setter<State>
  ) => {
    if (!action) return state

    const type = action.type as BaseAction<Action>['type']
    const handler = handlers[type]
    if (!handler) {
      send(name, action, state)
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
      for await (const nextState of result) {
        if (!nextState) continue
        next = { ...next, ...nextState }
        send(name, action, next)
        setter(next)
      }

      return
    }

    const next = { ...state, ...result }
    send(name, action, next)
    setter(next)
  }

  const store = create<State & { dispatch: Dispatcher<State, Action> }>((set, get) => {
    const dispatch = async (action: BaseAction<Action>) => {
      const next = await reducer(get(), action, dispatch, set)
      if (action) send(name, action, next)
      return next
    }

    dispatch({ type: '__INIT' })

    return {
      ...init,
      dispatch,
    }
  })

  type PatchedStore = typeof store & { dispatch: Dispatcher<State, Action> }

  const patchedStore = store as PatchedStore
  patchedStore.dispatch = store.getState().dispatch
  stores[name] = store

  send(name, { type: 'INIT' }, init)
  return patchedStore
}

function isPromise<S>(value: any): value is Promise<Partial<S> | void> {
  if (!value) return false
  return 'then' in value && typeof value.then === 'function'
}

function isGenerator<S>(value: any): value is AsyncGenerator<Partial<S> | void> | Generator<Partial<S>> {
  if (!value) return false
  return 'next' in value && typeof value.next === 'function'
}
