import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import './App.css'

// Import components
import LandingPage from './components/LandingPage'
import LoginPage from './components/LoginPage'
import CustomerDashboard from './components/CustomerDashboard'
import StaffDashboard from './components/StaffDashboard'
import AdminDashboard from './components/AdminDashboard'
import MenuPage from './components/MenuPage'
import CheckoutPage from './components/CheckoutPage'
import OrderHistory from './components/OrderHistory'
import StaffManagement from './components/StaffManagement'
import Reports from './components/Reports'
import StockManagement from './components/StockManagement'
import Suppliers from './components/Suppliers'

function App() {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.clear()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route 
              path="/login" 
              element={
                user ? (
                  <Navigate to={`/${user.role}-dashboard`} replace />
                ) : (
                  <LoginPage onLogin={handleLogin} />
                )
              } 
            />
            <Route 
              path="/customer-dashboard" 
              element={
                user && user.role === 'customer' ? (
                  <CustomerDashboard user={user} onLogout={handleLogout} />
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
            <Route 
              path="/staff-dashboard" 
              element={
                user && user.role === 'staff' ? (
                  <StaffDashboard user={user} onLogout={handleLogout} />
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
            <Route 
              path="/admin-dashboard" 
              element={
                user && user.role === 'admin' ? (
                  <AdminDashboard user={user} onLogout={handleLogout} />
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
            <Route 
              path="/menu" 
              element={
                user ? (
                  <MenuPage user={user} onLogout={handleLogout} />
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
            <Route 
              path="/checkout" 
              element={
                user && user.role === 'customer' ? (
                  <CheckoutPage user={user} onLogout={handleLogout} />
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
            <Route 
              path="/order-history" 
              element={
                user && user.role === 'customer' ? (
                  <OrderHistory user={user} onLogout={handleLogout} />
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
            {/* Admin Routes */}
            <Route 
              path="/admin/staff-management" 
              element={
                user && user.role === 'admin' ? (
                  <StaffManagement user={user} onLogout={handleLogout} />
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
            <Route 
              path="/admin/reports" 
              element={
                user && user.role === 'admin' ? (
                  <Reports user={user} onLogout={handleLogout} />
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
            <Route 
              path="/admin/stock-management" 
              element={
                user && user.role === 'admin' ? (
                  <StockManagement user={user} onLogout={handleLogout} />
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
            <Route 
              path="/admin/suppliers" 
              element={
                user && user.role === 'admin' ? (
                  <Suppliers user={user} onLogout={handleLogout} />
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
          </Routes>
        </AnimatePresence>
      </div>
    </Router>
  )
}

export default App




