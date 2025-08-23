import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Wallet = () => {
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      const [balanceRes, transactionsRes] = await Promise.all([
        api.get('/wallet/balance'),
        api.get('/wallet/transactions')
      ]);
      
      setBalance(balanceRes.data.balance);
      setTransactions(transactionsRes.data);
    } catch (error) {
      setError('Failed to load wallet data');
      console.error('Error fetching wallet data:', error);
    }
  };

  const handleAddMoney = async () => {
    if (!amount || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await api.post('/wallet/add', { amount: parseFloat(amount) });
      setAmount('');
      setSuccess('Money added successfully!');
      fetchWalletData(); // Refresh data
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add money');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Wallet</h2>
      
      {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}
      {success && <div style={{ color: 'green', marginBottom: '15px' }}>{success}</div>}
      
      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px', marginBottom: '20px' }}>
        <h3>Current Balance: ${balance.toFixed(2)}</h3>
        
        <div style={{ marginTop: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Add Money:</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              style={{ flex: 1, padding: '8px' }}
            />
            <button 
              onClick={handleAddMoney} 
              disabled={loading}
              style={{ 
                padding: '8px 16px', 
                backgroundColor: loading ? '#ccc' : '#28a745', 
                color: 'white', 
                border: 'none',
                borderRadius: '3px'
              }}
            >
              {loading ? 'Processing...' : 'Add Money'}
            </button>
          </div>
        </div>
      </div>
      
      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px' }}>
        <h3>Transaction History</h3>
        {transactions.length === 0 ? (
          <p>No transactions yet</p>
        ) : (
          <div>
            {transactions.map(transaction => (
              <div key={transaction._id} style={{ 
                border: '1px solid #eee', 
                padding: '15px', 
                margin: '10px 0',
                borderRadius: '3px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p><strong>Amount: ${transaction.amount.toFixed(2)}</strong></p>
                    <p>Type: {transaction.type}</p>
                    <p>Status: {transaction.status}</p>
                    {transaction.order && (
                      <p>Order: {transaction.order._id}</p>
                    )}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '14px', color: '#666' }}>
                      {new Date(transaction.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wallet;