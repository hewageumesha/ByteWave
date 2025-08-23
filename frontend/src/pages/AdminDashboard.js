import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/admin/dashboard');
      setStats(response.data);
    } catch (error) {
      setError('Failed to load dashboard data');
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Admin Dashboard</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px', textAlign: 'center' }}>
          <h3>Total Users</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>{stats.totalUsers}</p>
        </div>
        
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px', textAlign: 'center' }}>
          <h3>Total Orders</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>{stats.totalOrders}</p>
        </div>
        
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px', textAlign: 'center' }}>
          <h3>Total Revenue</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#fd7e14' }}>${stats.totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px' }}>
        <h3>Recent Orders</h3>
        {stats.recentOrders.length === 0 ? (
          <p>No recent orders</p>
        ) : (
          <div>
            {stats.recentOrders.map(order => (
              <div key={order._id} style={{ 
                border: '1px solid #eee', 
                padding: '15px', 
                margin: '10px 0',
                borderRadius: '3px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p><strong>Order #{order._id}</strong></p>
                    <p>Customer: {order.user?.name}</p>
                    <p>Total: ${order.total.toFixed(2)}</p>
                    <p>Status: {order.status}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '14px', color: '#666' }}>
                      {new Date(order.createdAt).toLocaleString()}
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

export default AdminDashboard;