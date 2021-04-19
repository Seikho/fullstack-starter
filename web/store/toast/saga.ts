import { saga } from '../store'

let id = 0

saga('TOAST_ADD', (action, dispatch) => {
  let nextId = ++id
  const ttl = action.ttl ?? 8

  dispatch({
    type: 'TOAST_ADDED',
    id: nextId,
    kind: action.kind,
    title: action.title,
    message: action.message,
    ttl,
  })

  setTimeout(() => dispatch({ type: 'TOAST_REMOVE', id: nextId }), ttl * 1000)
})
