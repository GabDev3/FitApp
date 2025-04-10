import React, { useState } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
import NotFound from "./pages/NotFound"

function Logout() {
    localStorage.clear()
    return <Navigate to="/login" />
}

function RegisterAndLogout() {
    localStorage.clear()
    return <Register />
}

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
        <Routes>
            <Route path = "/login" element={<Login />} />
            <Route path = "/logout" element={<Logout />} />
            <Route path = "/register" element={<RegisterAndLogout />} />
            <Route path = "/" element={<Home />} />
            <Route path = "*" element={<NotFound />} />

        </Routes>
    </BrowserRouter>
  )
}

export default App
