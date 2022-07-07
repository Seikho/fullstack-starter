import create from 'zustand'

type ReducerReturn<S> = Promise<Partial<S> | void> | Partial<S> | void
export type Dispatcher<S, A extends { type: string }> = (action: A) => ReducerReturn<S>

type ReducerBody<S, A extends { type: string }> = {
  [Type in A['type']]?: (state: S, action: Extract<A, { type: Type }>, dispatch: Dispatcher<S, A>) => ReducerReturn<S>
}

type InitAction = { type: '__INIT' }

type BaseAction<T extends { type: string }> = T | InitAction

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
    dispatch: Dispatcher<State, BaseAction<Action>>
  ) => {
    if (!action) return state

    const type = action.type as BaseAction<Action>['type']
    const handler = handlers[type]
    if (!handler) return state

    const nextState = await handler(state, action as any, dispatch)
    if (!nextState) return state

    return {
      ...state,
      ...nextState,
    }
  }

  const store = create<State & { dispatch: Dispatcher<State, Action> }>((set, get) => {
    const dispatch = async (action: BaseAction<Action>) => {
      const next = await reducer(get(), action, dispatch)
      if (action) devTools.send({ ...action, type: `${name}.${action.type}` }, next)
      set(next)
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
