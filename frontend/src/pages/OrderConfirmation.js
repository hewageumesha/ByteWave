import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      setOrder(response.data);
    } catch (error) {
      setError('Failed to load order details');
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading order details...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!order) return <div>Order not found</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Order Confirmation</h2>
      
      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px', marginBottom: '20px' }}>
        <h3>Order Details</h3>
        <p><strong>Order ID:</strong> {order._id}</p>
        <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
        <p><strong>Pickup Time:</strong> {new Date(order.pickupTime).toLocaleString()}</p>
        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
        <p><strong>Payment Status:</strong> {order.paymentStatus}</p>
      </div>

      {order.qrCodeImage && (
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px', marginBottom: '20px', textAlign: 'center' }}>
          <h3>QR Code for Pickup</h3>
          <img 
            src={`http://localhost:5000${order.qrCodeImage}`} 
            alt="Order QR Code" 
            style={{ width: '200px', height: '200px', border: '1px solid #ccc' }}
          />
          <p style={{ marginTop: '10px', color: '#666' }}>
            Show this QR code to staff during pickup
          </p>
        </div>
      )}

      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px' }}>
        <h3>Order Items</h3>
        {order.items.map((item, index) => (
          <div key={index} style={{ marginBottom: '10px', padding: '10px', borderBottom: '1px solid #eee' }}>
            <p><strong>{item.quantity}x {item.product?.name}</strong></p>
            <p>Price: ${(item.price * item.quantity).toFixed(2)}</p>
            {item.customizations && item.customizations.length > 0 && (
              <div>
                <p style={{ fontSize: '14px', color: '#666' }}>Customizations:</p>
                <ul style={{ fontSize: '12px' }}>
                  {item.customizations.map((custom, i) => (
                    <li key={i}>{custom.action} {custom.ingredient}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button 
          onClick={() => window.location.href = '/'}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none',
            borderRadius: '3px'
          }}
        >
          Back to Menu
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmation;