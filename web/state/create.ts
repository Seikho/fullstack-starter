import create from 'zustand'

type ReducerReturn<S> = Promise<Partial<S> | void> | Partial<S> | void | AsyncIterator<Partial<S> | void>
export type Dispatcher<S, A extends { type: string }> = (action: A) => ReducerReturn<S>

type ReducerBody<S, A extends { type: string }> = {
  [Type in A['type']]?: (state: S, action: Extract<A, { type: Type }>, dispatch: Dispatcher<S, A>) => ReducerReturn<S>
}

type InitAction = { type: '__INIT' }

type BaseAction<T extends { type: string }> = T | InitAction

type Setter<S> = (state: S) => void

const win: any = window
const devTools = win.__REDUX_DEVTOOLS_EXTENSION__?.connect?.() || { send: () => {} }

export function createStore<State, Action extends { type: string }>(
  name: string,
  init: State,
  handlers: ReducerBody<State, BaseAction<Action>>
) {
  const reducer = async (
    state: State,
    action: Action | InitAction,
    dispatch: Dispatcher<State, BaseAction<Action>>,
    setter: Setter<State>
  ) => {
    if (!action) return state

    const type = action.type as BaseAction<Action>['type']
    const handler = handlers[type]
    if (!handler) return state

    const result = handler(state, action as any, dispatch)
    if (!result) return state

    if (isPromise<State>(result)) {
      const nextState = await result
      const next = { ...state, ...nextState }
      devTools.send({ ...action, type: `${name}.${action.type}` }, next)
      setter(next)
      return
    }

    if (isAsyncGenerator<State>(result)) {
      let next = { ...state }
      for await (const nextState of result) {
        if (!nextState) continue
        next = { ...next, ...nextState }
        devTools.send({ ...action, type: `${name}.${action.type}` }, next)
        setter(next)
      }
      return
    }

    const next = { ...state, ...result }
    devTools.send({ ...action, type: `${name}.${action.type}` }, next)
    setter(next)
  }

  const store = create<State & { dispatch: Dispatcher<State, Action> }>((set, get) => {
    const dispatch = async (action: BaseAction<Action>) => {
      const next = await reducer(get(), action, dispatch, set)
      if (action) devTools.send({ ...action, type: `${name}.${action.type}` }, next)
      return next
    }

    dispatch({ type: '__INIT' })

    return {
      ...init,
      dispatch,
    }
  })

  return store
}

function isPromise<S>(value: any): value is Promise<Partial<S> | void> {
  if (!value) return false
  return 'then' in value && typeof value.then === 'function'
}

function isAsyncGenerator<S>(value: any): value is AsyncGenerator<Partial<S> | void> {
  if (!value) return false
  return 'next' in value && typeof value.next === 'function'
}
