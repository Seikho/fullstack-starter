import * as React from 'react'
import { Link } from 'react-router-dom'
import { stores } from '../state'

export const Sidebar: React.FC = () => {
  const user = stores.user()
  if (!user.loggedIn) return null
  const mod = user.menu ? 'expand' : ''

  const toggleMenu = () => user.dispatch({ type: 'TOGGLE_MENU' })

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
