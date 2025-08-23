import React, { useState, useEffect } from 'react';
import api from '../services/api';

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await api.get('/admin/staff');
      setStaff(response.data);
    } catch (error) {
      setError('Failed to load staff');
      console.error('Error fetching staff:', error);
    }
  };

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    
    if (!newStaff.name || !newStaff.email || !newStaff.password) {
      setError('Please fill all fields');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await api.post('/admin/staff', newStaff);
      setNewStaff({ name: '', email: '', password: '' });
      setSuccess('Staff account created successfully');
      fetchStaff(); // Refresh staff list
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create staff account');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStaff = async (staffId) => {
    if (!window.confirm('Are you sure you want to delete this staff account?')) {
      return;
    }

    try {
      await api.delete(`/admin/staff/${staffId}`);
      setSuccess('Staff account deleted successfully');
      fetchStaff(); // Refresh staff list
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete staff account');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Staff Management</h2>
      
      {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}
      {success && <div style={{ color: 'green', marginBottom: '15px' }}>{success}</div>}
      
      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px', marginBottom: '20px' }}>
        <h3>Add New Staff</h3>
        <form onSubmit={handleCreateStaff}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Name:</label>
            <input
              type="text"
              value={newStaff.name}
              onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
              required
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
            <input
              type="email"
              value={newStaff.email}
              onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
              required
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
            <input
              type="password"
              value={newStaff.password}
              onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
              required
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '10px', 
              backgroundColor: loading ? '#ccc' : '#28a745', 
              color: 'white', 
              border: 'none',
              borderRadius: '3px'
            }}
          >
            {loading ? 'Creating...' : 'Create Staff Account'}
          </button>
        </form>
      </div>

      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px' }}>
        <h3>Staff List</h3>
        {staff.length === 0 ? (
          <p>No staff accounts found</p>
        ) : (
          <div>
            {staff.map(staffMember => (
              <div key={staffMember._id} style={{ 
                border: '1px solid #ccc', 
                padding: '15px', 
                margin: '10px 0',
                borderRadius: '3px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4>{staffMember.name}</h4>
                    <p>Email: {staffMember.email}</p>
                    <p>Status: {staffMember.active ? 'Active' : 'Inactive'}</p>
                    <p>Role: {staffMember.role}</p>
                  </div>
                  <div>
                    <button 
                      onClick={() => handleDeleteStaff(staffMember._id)}
                      style={{ 
                        padding: '8px 12px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px'
                      }}
                    >
                      Delete Account
                    </button>
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

export default StaffManagement;