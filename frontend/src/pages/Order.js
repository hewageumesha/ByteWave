import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Order = ({ orderItems, onUpdateOrder, onRemoveItem }) => {
  const [pickupTime, setPickupTime] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const total = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handlePlaceOrder = async () => {
    if (!pickupTime) {
      setError('Please select a pickup time');
      return;
    }

    if (orderItems.length === 0) {
      setError('Please add items to your order');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const orderData = {
        items: orderItems.map(item => ({
          product: item._id,
          quantity: item.quantity,
          customizations: item.customizations || []
        })),
        paymentMethod,
        pickupTime: new Date(pickupTime).toISOString()
      };

      const response = await api.post('/orders', orderData);
      alert('Order placed successfully!');
      
      // Navigate to order confirmation
      navigate(`/order-confirmation/${response.data._id}`);
      
      // Clear order
      onUpdateOrder([]);
    } catch (error) {
      console.error('Error placing order:', error);
      setError(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const increaseQuantity = (index) => {
    const newItems = [...orderItems];
    newItems[index].quantity += 1;
    onUpdateOrder(newItems);
  };

  const decreaseQuantity = (index) => {
    const newItems = [...orderItems];
    if (newItems[index].quantity > 1) {
      newItems[index].quantity -= 1;
      onUpdateOrder(newItems);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Your Order</h2>
      
      {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}
      
      {orderItems.length === 0 ? (
        <p>Your order is empty. Add some items from the menu!</p>
      ) : (
        <>
          {orderItems.map((item, index) => (
            <div key={index} style={{ 
              border: '1px solid #ccc', 
              padding: '15px', 
              margin: '10px 0',
              borderRadius: '5px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4>{item.name} x {item.quantity}</h4>
                  <p>Price: ${(item.price * item.quantity).toFixed(2)}</p>
                  {item.customizations && item.customizations.length > 0 && (
                    <div>
                      <p style={{ fontSize: '14px', color: '#666' }}>Customizations:</p>
                      <ul style={{ fontSize: '12px', margin: '5px 0' }}>
                        {item.customizations.map((custom, i) => (
                          <li key={i}>{custom.action} {custom.ingredient}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button 
                    onClick={() => decreaseQuantity(index)}
                    style={{ padding: '5px 10px' }}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button 
                    onClick={() => increaseQuantity(index)}
                    style={{ padding: '5px 10px' }}
                  >
                    +
                  </button>
                  <button 
                    onClick={() => onRemoveItem(index)}
                    style={{ 
                      padding: '5px 10px', 
                      backgroundColor: '#dc3545', 
                      color: 'white', 
                      border: 'none',
                      marginLeft: '10px'
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '5px' }}>
            <h3>Total: ${total.toFixed(2)}</h3>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Pickup Time:</label>
              <input
                type="datetime-local"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                required
                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
              />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Payment Method:</label>
              <select 
                value={paymentMethod} 
                onChange={(e) => setPaymentMethod(e.target.value)}
                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
              >
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="wallet" disabled={user.wallet < total}>
                  Wallet (${user.wallet.toFixed(2)})
                </option>
              </select>
              {paymentMethod === 'wallet' && user.wallet < total && (
                <p style={{ color: 'red', marginTop: '5px' }}>Insufficient wallet balance</p>
              )}
            </div>
            
            <button 
              onClick={handlePlaceOrder} 
              disabled={loading || (paymentMethod === 'wallet' && user.wallet < total)}
              style={{ 
                width: '100%', 
                padding: '12px', 
                backgroundColor: loading ? '#ccc' : '#28a745', 
                color: 'white', 
                border: 'none',
                borderRadius: '3px'
              }}
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Order;