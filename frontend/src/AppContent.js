import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductList from './pages/ProductList';
import Order from './pages/Order';
import OrderConfirmation from './pages/OrderConfirmation';
import Wallet from './pages/Wallet';
import StaffDashboard from './pages/StaffDashboard';
import Inventory from './pages/Inventory';
import StaffManagement from './pages/StaffManagement';
import AdminDashboard from './pages/AdminDashboard';

const AppContent = () => {
  const { user, logout } = useAuth();
  const [orderItems, setOrderItems] = useState([]);

  const handleAddToOrder = (product, customize = false) => {
    if (customize) {
      // For simplicity, we'll just add the product as-is
      setOrderItems(prev => [...prev, { ...product, quantity: 1 }]);
    } else {
      const existingItem = orderItems.find(item => item._id === product._id);
      if (existingItem) {
        setOrderItems(prev => prev.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      } else {
        setOrderItems(prev => [...prev, { ...product, quantity: 1 }]);
      }
    }
  };

  const handleRemoveItem = (index) => {
    setOrderItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpdateOrder = (newOrder) => {
    setOrderItems(newOrder);
  };

  if (!user) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <div>
        <header style={{ padding: '10px', borderBottom: '1px solid #ccc', marginBottom: '20px' }}>
          <h1>Food Ordering System</h1>
          <p>Welcome, {user.name} ({user.role})</p>
          <button onClick={logout} style={{ padding: '5px 10px', marginBottom: '10px' }}>
            Logout
          </button>
          <nav style={{ marginTop: '10px' }}>
            <a href="/" style={{ marginRight: '10px' }}>Menu</a> 
            <a href="/order" style={{ marginRight: '10px' }}>Order</a> 
            <a href="/wallet" style={{ marginRight: '10px' }}>Wallet</a>
            {user.role === 'staff' || user.role === 'admin' ? (
              <>
                <a href="/staff" style={{ marginRight: '10px' }}>Staff Dashboard</a>
                <a href="/inventory" style={{ marginRight: '10px' }}>Inventory</a>
              </>
            ) : null}
            {user.role === 'admin' ? (
              <>
                <a href="/admin/staff" style={{ marginRight: '10px' }}>Manage Staff</a>
                <a href="/admin/dashboard">Admin Dashboard</a>
              </>
            ) : null}
          </nav>
        </header>

        <Routes>
          <Route path="/" element={
            <ProductList onAddToOrder={handleAddToOrder} />
          } />
          <Route path="/order" element={
            <Order 
              orderItems={orderItems} 
              onUpdateOrder={handleUpdateOrder}
              onRemoveItem={handleRemoveItem}
            />
          } />
          <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
          <Route path="/wallet" element={<Wallet />} />
          
          {/* Staff routes */}
          <Route path="/staff" element={
            user.role === 'staff' || user.role === 'admin' ? 
            <StaffDashboard /> : <Navigate to="/" />
          } />
          <Route path="/inventory" element={
            user.role === 'staff' || user.role === 'admin' ? 
            <Inventory /> : <Navigate to="/" />
          } />
          
          {/* Admin routes */}
          <Route path="/admin/staff" element={
            user.role === 'admin' ? 
            <StaffManagement /> : <Navigate to="/" />
          } />
          <Route path="/admin/dashboard" element={
            user.role === 'admin' ? 
            <AdminDashboard /> : <Navigate to="/" />
          } />
        </Routes>
      </div>
    </Router>
  );
};

export default AppContent;