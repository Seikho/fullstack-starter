import './guest.scss'
import * as React from 'react'
import { withDispatch } from '/web/store'

export const Guest = withDispatch(({ dispatch }) => {
  const signin = () => {
    dispatch({ type: 'USER_REQUEST_LOGIN', username: user, password: pass })
  }
  const signup = () => {
    if (!canRegister) return
    dispatch({ type: 'USER_REQUEST_REGISTER', username: user, password: pass, confirm: conf })
  }

  const [user, setUser] = React.useState('')
  const [pass, setPass] = React.useState('')
  const [conf, setConf] = React.useState('')
  const [view, setView] = React.useState<'login' | 'register'>('login')

  const canRegister = pass.length >= 4 && pass === conf

  const loginMod = view === 'login' ? 'guest__view--sel' : ''
  const regMod = view === 'register' ? 'guest__view--sel' : ''

  return (
    <div className="guest">
      <div className="guest__box">
        <div className="guest__buttons">
          <div className={`guest__view ${loginMod}`} onClick={() => setView('login')}>
            Login
          </div>
          <div className={`guest__view ${regMod}`} onClick={() => setView('register')}>
            Register
          </div>
        </div>

        <div>
          <input
            type="text"
            placeholder="Username"
            onChange={(ev) => setUser(ev.currentTarget.value)}
            onKeyUp={(ev) => (ev.key === 'Enter' ? signin() : undefined)}
          />
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            onChange={(ev) => setPass(ev.currentTarget.value)}
            onKeyUp={(ev) => (ev.key === 'Enter' ? signin() : undefined)}
          />
        </div>

        <div>
          <input
            className={view === 'login' ? 'guest--hide' : ''}
            type="password"
            placeholder="Confirm"
            onChange={(ev) => setConf(ev.currentTarget.value)}
            onKeyUp={(ev) => (ev.key === 'Enter' ? signin() : undefined)}
          />
        </div>

        <div className="guest__buttons">
          <button
            className={view === 'register' ? 'guest--none' : ''}
            disabled={!user || !pass}
            onClick={signin}
            v-if="!register"
          >
            Login
          </button>
          <button
            className={view === 'login' ? 'guest--none' : ''}
            disabled={!canRegister}
            onClick={signup}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  )
})
