import * as React from 'react'
import { withState } from '../state'

export const Header = withState(
  ({ user: { loggedIn } }) => ({ loggedIn }),
  ({ loggedIn, dispatch }) => {
    const toggleMenu = () => {
      dispatch({ type: 'USER_TOGGLE_MENU' })
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
)
