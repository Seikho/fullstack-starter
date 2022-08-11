import './style/color.scss'
import './app.scss'
import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { Home } from './page/home'
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom'
import { Layout, Logout } from './layout'
import { Success } from './page/home/Success'
import { stores } from './state'

export const App = () => {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/success" element={<Success />} />
          <Route path="/" element={<Home />} />
          <Route element={<Private />}>
            <Route path="/profile" element={<div>Profile</div>} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/home" element={<Home />} />
            <Route path="/" element={<Home />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  )
}

const Private: React.FC = () => {
  const loggedIn = stores.user((store) => store.loggedIn)

  if (!loggedIn) return <Navigate to="/" />
  return <Outlet />
}

const container = document.querySelector('#app')
const root = createRoot(container!)

root.render(<App />)
