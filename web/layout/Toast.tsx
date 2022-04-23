import * as React from 'react'
import { withState } from '../state'
import { Toast } from '../state/toast'

export const Toasts: React.FC = withState(
  ({ toast }) => ({ toasts: toast.toasts }),
  ({ toasts }) => {
    return (
      <div>
        <div className="toast">
          {toasts.map((toast, i) => (
            <Item key={i} title={toast.title} message={toast.message} type={toast.type} />
          ))}
        </div>
      </div>
    )
  }
)

const Item = ({ title, message, type }: Toast) => {
  return (
    <div className={`toast__show ${type ?? 'default'}`}>
      <div className="toast__title">{getTitle(type, title)}</div>
      {message && <div className="toast__msg">{message}</div>}
    </div>
  )
}

function getTitle(type: Toast['type'], title?: string) {
  if (title) return title
  switch (type) {
    case 'default':
    case 'info':
      return 'Info'

    case 'warn':
      return 'Warning'

    case 'success':
      return 'Success'

    case 'error':
      return 'Error'

    case 'naked':
      return ''
  }
}
