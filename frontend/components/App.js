import React from 'react'
import Home from './Home'
import Form from './Form'
import { Routes, Route, Link, useLocation } from 'react-router-dom'





function App() {
  const location = useLocation()
  const { pathname } = location

  return (
    <div id="app">
      <nav>
        <Link to="/" className={pathname == '/' ? 'active' : ''}>Home</Link>
        <Link to="/order" className={pathname == '/order' ? 'active' : ''}>Order</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/order" element={<Form />} />
      </Routes>
    </div>
  )
}

export default App
