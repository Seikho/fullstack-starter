import './style/color.scss'
import './app.scss'
import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { Home } from './page/home'
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom'
import { Layout, Logout } from './layout'
import { Success } from './page/home/Success'
import { userStore } from './state'
import { Profile } from './page/profile'

export const App = () => {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/success" element={<Success />} />
          <Route element={<Private />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/home" element={<Home />} />
          </Route>
          <Route path="/" element={<Home />} />
        </Route>
      </Routes>
    </Router>
  )
}

const Private: React.FC = () => {
  const loggedIn = userStore((store) => store.loggedIn)

  if (!loggedIn) return <Navigate to="/" />
  return <Outlet />
}

const container = document.querySelector('#app')
const root = createRoot(container!)

root.render(<App />)
