import './style.scss'
import React from 'react'

type DrawerProps = {
  show: boolean
  close: () => void
  title: string
  children: React.ReactNode
}

export const Drawer: React.FC<DrawerProps> = ({ show, close, children, title }) => {
  const showMod = show ? `side-drawer--show` : `side-drawer--hide`

  return (
    <div className={`side-drawer ${showMod}`}>
      <div className={`side-drawer__content ${showMod}`}>
        <div className="side-drawer__header">
          <div>{title}</div>
          <div className="side-drawer__icon" onClick={close}>
            ✕
          </div>
        </div>
        <div className="side-drawer__body">{children}</div>
      </div>
    </div>
  )
}
