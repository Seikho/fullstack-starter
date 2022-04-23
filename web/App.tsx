import './style/color.scss'
import './app.scss'
import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { store, withState } from './state'
import { Provider } from 'react-redux'
import { Home } from './page/home'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { Layout, Logout } from './layout'
import { Success } from './page/home/Success'

export const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/success" element={<Success />} />
            <Route path="/profile" element={<Private component={() => <div>Profile</div>} />} />
            <Route path="/logout" element={<Private component={Logout} />} />
            <Route path="/home" element={<Home />} />
            <Route path="/" element={<Home />} />
          </Route>
        </Routes>
      </Router>
    </Provider>
  )
}

type Props = { component: React.FC }

const Private: React.FC<Props> = withState(
  ({ user }) => ({ isLoggedIn: user.loggedIn }),
  (props) => {
    if (!props.isLoggedIn) return <Navigate to="/" />
    return props.component(props)
  }
)

const container = document.querySelector('#app')
const root = createRoot(container!)

root.render(<App />)
