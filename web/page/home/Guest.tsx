import './guest.scss'
import * as React from 'react'
import { userStore } from '../../state'

export const Guest: React.FC = () => {
  const signin = (user: string, pass: string) => {
    userStore.dispatch({ type: 'REQUEST_LOGIN', username: user, password: pass })
  }
  const signup = (user: string, pass: string) => {
    userStore.dispatch({ type: 'REQUEST_REGISTER', username: user, password: pass, confirm: pass })
  }

  const [view, setView] = React.useState<'login' | 'register' | 'social'>('login')

  const socialMod = view === 'social' ? 'guest__view--sel' : ''
  const loginMod = view === 'login' ? 'guest__view--sel' : ''
  const regMod = view === 'register' ? 'guest__view--sel' : ''

  return (
    <div className="guest">
      <div className="guest__box">
        <div className="guest__buttons">
          <div className={`guest__view ${socialMod}`} onClick={() => setView('social')}>
            Social
          </div>
          <div className={`guest__view ${loginMod}`} onClick={() => setView('login')}>
            Login
          </div>
          <div className={`guest__view ${regMod}`} onClick={() => setView('register')}>
            Register
          </div>
        </div>

        {view === 'social' && <Social />}
        {view === 'login' && <Manual signin={signin} />}
        {view === 'register' && <Register register={signup} />}
      </div>
    </div>
  )
}

const Social = () => (
  <div className="pad column center biggaps">
    <a href="/api/auth/facebook">
      <button>Login with Facebook</button>
    </a>
    <a href="/api/auth/google">
      <button>Login with Google</button>
    </a>
  </div>
)

type Submit = (user: string, pass: string) => void

const Manual: React.FC<{ signin: Submit }> = ({ signin }) => {
  const [user, setUser] = React.useState('')
  const [pass, setPass] = React.useState('')

  return (
    <div className="pad biggaps column center">
      <div>
        <input
          type="text"
          placeholder="Username"
          onChange={(ev) => setUser(ev.currentTarget.value)}
          onKeyUp={(ev) => (ev.key === 'Enter' ? signin(user, pass) : undefined)}
        />
      </div>

      <div>
        <input
          type="password"
          placeholder="Password"
          onChange={(ev) => setPass(ev.currentTarget.value)}
          onKeyUp={(ev) => (ev.key === 'Enter' ? signin(user, pass) : undefined)}
        />
      </div>

      <div className="guest__buttons">
        <button disabled={!user || !pass} onClick={() => signin(user, pass)}>
          Login
        </button>
      </div>
    </div>
  )
}

const Register: React.FC<{ register: Submit }> = ({ register }) => {
  const [user, setUser] = React.useState('')
  const [pass, setPass] = React.useState('')
  const [conf, setConf] = React.useState('')

  const isValid = !!user && !!pass && !!conf && pass === conf && user.length >= 4

  const submit = () => {
    if (!isValid) return
    register(user, pass)
  }

  return (
    <div className="pad biggaps column center">
      <div>
        <input
          type="text"
          placeholder="Username"
          onChange={(ev) => setUser(ev.currentTarget.value)}
          onKeyUp={(ev) => (ev.key === 'Enter' ? submit() : undefined)}
        />
      </div>

      <div>
        <input
          type="password"
          placeholder="Password"
          onChange={(ev) => setPass(ev.currentTarget.value)}
          onKeyUp={(ev) => (ev.key === 'Enter' ? submit() : undefined)}
        />
      </div>

      <div>
        <input
          type="password"
          placeholder="Confirm"
          onChange={(ev) => setConf(ev.currentTarget.value)}
          onKeyUp={(ev) => (ev.key === 'Enter' ? submit() : undefined)}
        />
      </div>

      <div className="guest__buttons">
        <button disabled={!isValid} onClick={submit}>
          Register
        </button>
      </div>
    </div>
  )
}
