import * as React from 'react'
import { Link } from 'react-router-dom'
import { withState } from '../state'

export const Sidebar = withState(
  ({ user }) => ({ menu: user.menu, loggedIn: user.loggedIn }),
  ({ menu, loggedIn, dispatch }) => {
    if (!loggedIn) return null
    const mod = menu ? 'expand' : ''

    const toggleMenu = () => dispatch({ type: 'USER_TOGGLE_MENU' })

    return (
      <div className={`layout__sidebar ${mod}`}>
        <div className={`layout__menu ${mod}`}>
          <Link className="layout__link" to="/">
            Home
          </Link>
          <Link className="layout__link" to="/profile">
            Profile
          </Link>
          <Link className="layout__link" to="/logout">
            Logout
          </Link>
        </div>
        <div className={`layout__overlay ${mod} hide-desktop`} onClick={toggleMenu}></div>
      </div>
    )
  }
)
