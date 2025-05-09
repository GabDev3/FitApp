import React, { useState } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
import NotFound from "./pages/NotFound"
import ProductInfo from "./pages/ProductInfo"
import CreateProduct from "./pages/CreateProduct"
import ProtectedRoute from "./components/ProtectedRoute"


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
            <Route
             path = "/"
              element={
                <ProtectedRoute>
                    <Home />
                </ProtectedRoute>
              }
            />
            <Route path = "/product/create"
             element={
                 <ProtectedRoute>
                    <CreateProduct />
                </ProtectedRoute>
             }
             />
            <Route path = "/login" element={<Login />} />
            <Route path = "/logout" element={<Logout />} />
            <Route path = "/register" element={<RegisterAndLogout />} />
            <Route path = "/product/info/:id" element={<ProductInfo />} />
            <Route path = "*" element={<NotFound />} />

        </Routes>
    </BrowserRouter>
  )
}

export default App
