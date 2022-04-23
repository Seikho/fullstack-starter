import './layout.scss'
import * as React from 'react'
import { withState } from '../state'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { Toasts } from './Toast'
import { Outlet } from 'react-router'

export const Layout = withState(
  ({ user }) => ({ userId: user.userId || 'Guest', menu: user.menu, loggedIn: user.loggedIn }),
  ({ menu, loggedIn }) => {
    const mod = menu ? 'layout--expand' : ''
    const guestMod = loggedIn ? '' : 'full'

    return (
      <div>
        <div className={`layout ${mod}`}>
          <Header />

          <div className="layout__content">
            <Sidebar />
            <div className={`layout__container ${guestMod}`}>
              <Outlet />
            </div>
          </div>
        </div>
        <Toasts />
      </div>
    )
  }
)
