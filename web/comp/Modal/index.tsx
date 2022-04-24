import './style.scss'
import React from 'react'

type Props = {
  className?: string
  show: boolean
  close: () => void
  header?: React.FC | React.ReactElement
  footer?: React.FC | React.ReactElement
  children: React.ReactNode
}

export const Modal: React.FC<Props> = ({ show, close, children, ...props }) => {
  if (!show) return null

  const Header = props.header ? typeof props.header === 'function' ? <props.header /> : props.header : null

  const Footer = props.footer ? (
    typeof props.footer === 'function' ? (
      <props.footer />
    ) : (
      props.footer
    )
  ) : (
    <div className="right">
      <button className="light" onClick={close}>
        Close
      </button>
    </div>
  )
  return (
    <div className="modal">
      <div className="modal__overlay hide-mobile"></div>
      <div className="modal__container">
        <div className="modal__header">
          <div>{Header}</div>
          <div onClick={close} className="modal__close">
            ✕
          </div>
        </div>

        <div className="modal__content">{children}</div>

        <div className="modal__footer">{Footer}</div>
      </div>
    </div>
  )
}
