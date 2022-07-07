import * as React from 'react'
import { stores } from '../state'

export const Header: React.FC = () => {
  const { loggedIn, dispatch } = stores.user(({ loggedIn, dispatch }) => ({ loggedIn, dispatch }))
  const toggleMenu = () => {
    dispatch({ type: 'TOGGLE_MENU' })
  }

  const mod = loggedIn ? '' : 'hide'

  return (
    <div className="layout__header">
      <div className="layout__left">
        <div className="layout__brand hide-mobile">WEB-APP</div>
        <div className={`hamburger hide-desktop ${mod}`} onClick={toggleMenu}>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
      <div className="layout__center">
        <div className="layout__brand hide-desktop">WEB-APP</div>
      </div>
      <div className="layout__right hide-mobile"></div>
    </div>
  )
}
