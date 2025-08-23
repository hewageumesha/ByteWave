import React, { useState, useEffect } from 'react';
import api from '../services/api';

const StaffDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [scannedOrder, setScannedOrder] = useState(null);
  const [scanData, setScanData] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (error) {
      setError('Failed to load orders');
      console.error('Error fetching orders:', error);
    }
  };

  const handleScanQR = async () => {
    if (!scanData.trim()) {
      setError('Please enter QR code data');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await api.post('/orders/scan', { qrData: scanData });
      setScannedOrder(response.data);
      setScanData('');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to scan QR code');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status });
      setSuccess('Order status updated successfully');
      fetchOrders(); // Refresh orders
      if (scannedOrder && scannedOrder._id === orderId) {
        setScannedOrder({ ...scannedOrder, status });
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update order status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ffc107';
      case 'confirmed': return '#17a2b8';
      case 'preparing': return '#fd7e14';
      case 'ready': return '#28a745';
      case 'pickedup': return '#6c757d';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Staff Dashboard</h2>
      
      {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}
      
      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px', marginBottom: '20px' }}>
        <h3>Scan QR Code</h3>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <input
            type="text"
            value={scanData}
            onChange={(e) => setScanData(e.target.value)}
            placeholder="Paste QR code data here"
            style={{ flex: 1, padding: '8px' }}
          />
          <button 
            onClick={handleScanQR}
            disabled={loading}
            style={{ 
              padding: '8px 16px', 
              backgroundColor: loading ? '#ccc' : '#007bff', 
              color: 'white', 
              border: 'none',
              borderRadius: '3px'
            }}
          >
            {loading ? 'Scanning...' : 'Scan'}
          </button>
        </div>
        
        {scannedOrder && (
          <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '5px', backgroundColor: '#f8f9fa' }}>
            <h4>Scanned Order Details</h4>
            <p><strong>Order ID:</strong> {scannedOrder._id}</p>
            <p><strong>Customer:</strong> {scannedOrder.user?.name}</p>
            <p><strong>Total:</strong> ${scannedOrder.total.toFixed(2)}</p>
            <p>
              <strong>Status:</strong> 
              <span style={{ color: getStatusColor(scannedOrder.status), marginLeft: '5px' }}>
                {scannedOrder.status}
              </span>
            </p>
            
            <div style={{ marginTop: '15px' }}>
              <button 
                onClick={() => updateOrderStatus(scannedOrder._id, 'preparing')}
                disabled={scannedOrder.status !== 'confirmed'}
                style={{ 
                  marginRight: '10px', 
                  padding: '8px 12px',
                  backgroundColor: scannedOrder.status !== 'confirmed' ? '#ccc' : '#fd7e14',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px'
                }}
              >
                Start Preparing
              </button>
              <button 
                onClick={() => updateOrderStatus(scannedOrder._id, 'ready')}
                disabled={scannedOrder.status !== 'preparing'}
                style={{ 
                  marginRight: '10px', 
                  padding: '8px 12px',
                  backgroundColor: scannedOrder.status !== 'preparing' ? '#ccc' : '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px'
                }}
              >
                Mark as Ready
              </button>
              <button 
                onClick={() => updateOrderStatus(scannedOrder._id, 'pickedup')}
                disabled={scannedOrder.status !== 'ready'}
                style={{ 
                  padding: '8px 12px',
                  backgroundColor: scannedOrder.status !== 'ready' ? '#ccc' : '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px'
                }}
              >
                Mark as Picked Up
              </button>
            </div>
          </div>
        )}
      </div>

      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px' }}>
        <h3>All Orders</h3>
        <div>
          {orders.map(order => (
            <div key={order._id} style={{ 
              border: '1px solid #ccc', 
              padding: '15px', 
              margin: '10px 0',
              borderRadius: '5px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <p><strong>Order #{order._id}</strong></p>
                  <p><strong>Customer:</strong> {order.user?.name}</p>
                  <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
                  <p>
                    <strong>Status:</strong> 
                    <span style={{ color: getStatusColor(order.status), marginLeft: '5px' }}>
                      {order.status}
                    </span>
                  </p>
                  <p><strong>Pickup:</strong> {new Date(order.pickupTime).toLocaleString()}</p>
                </div>
                
                <div>
                  <button 
                    onClick={() => updateOrderStatus(order._id, 'preparing')}
                    disabled={order.status !== 'confirmed'}
                    style={{ 
                      display: 'block', 
                      width: '100%',
                      marginBottom: '5px',
                      padding: '6px 10px',
                      backgroundColor: order.status !== 'confirmed' ? '#ccc' : '#fd7e14',
                      color: 'white',
                      border: 'none',
                      borderRadius: '3px'
                    }}
                  >
                    Start Preparing
                  </button>
                  <button 
                    onClick={() => updateOrderStatus(order._id, 'ready')}
                    disabled={order.status !== 'preparing'}
                    style={{ 
                      display: 'block', 
                      width: '100%',
                      marginBottom: '5px',
                      padding: '6px 10px',
                      backgroundColor: order.status !== 'preparing' ? '#ccc' : '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '3px'
                    }}
                  >
                    Mark as Ready
                  </button>
                  <button 
                    onClick={() => updateOrderStatus(order._id, 'pickedup')}
                    disabled={order.status !== 'ready'}
                    style={{ 
                      display: 'block', 
                      width: '100%',
                      padding: '6px 10px',
                      backgroundColor: order.status !== 'ready' ? '#ccc' : '#6c757d',
                      color: 'white',
                      border: 'none',
                      borderRadius: '3px'
                    }}
                  >
                    Mark as Picked Up
                  </button>
                </div>
              </div>
              
              <div style={{ marginTop: '10px' }}>
                <p><strong>Items:</strong></p>
                <ul style={{ fontSize: '14px' }}>
                  {order.items.map((item, index) => (
                    <li key={index}>
                      {item.quantity}x {item.product?.name} - ${(item.price * item.quantity).toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;