import React, { useState, useEffect } from 'react';
import api from '../services/api';
import BarcodeDisplay from '../components/BarcodeDisplay';

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [scanData, setScanData] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/inventory/products');
      setProducts(response.data);
    } catch (error) {
      setError('Failed to load products');
      console.error('Error fetching products:', error);
    }
  };

  const handleBarcodeScan = async (action) => {
    if (!scanData.trim()) {
      setError('Please enter barcode data');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await api.post('/inventory/scan', {
        barcodeData: scanData,
        action,
        quantity: 1
      });
      
      setScanResult(response.data);
      setScanData('');
      setSuccess(`${action === 'use' ? 'Used' : 'Restocked'} item successfully`);
      fetchProducts(); // Refresh product list
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to process barcode');
    } finally {
      setLoading(false);
    }
  };

  const generateBarcode = async (productId) => {
    try {
      await api.post(`/inventory/${productId}/barcode`);
      setSuccess('Barcode generated successfully');
      fetchProducts(); // Refresh to show barcode
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to generate barcode');
    }
  };

  const updateStock = async (productId, newStock) => {
    try {
      await api.patch(`/inventory/${productId}/stock`, { stock: newStock });
      setSuccess('Stock updated successfully');
      fetchProducts();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update stock');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Inventory Management</h2>
      
      {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}
      {success && <div style={{ color: 'green', marginBottom: '15px' }}>{success}</div>}
      
      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px', marginBottom: '20px' }}>
        <h3>Barcode Scanner</h3>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <input
            type="text"
            value={scanData}
            onChange={(e) => setScanData(e.target.value)}
            placeholder="Enter barcode data"
            style={{ flex: 1, padding: '8px' }}
          />
          <button 
            onClick={() => handleBarcodeScan('use')}
            disabled={loading}
            style={{ 
              padding: '8px 12px',
              backgroundColor: loading ? '#ccc' : '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '3px'
            }}
          >
            Use Item
          </button>
          <button 
            onClick={() => handleBarcodeScan('restock')}
            disabled={loading}
            style={{ 
              padding: '8px 12px',
              backgroundColor: loading ? '#ccc' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '3px'
            }}
          >
            Restock Item
          </button>
        </div>
        
        {scanResult && (
          <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '5px', backgroundColor: '#f8f9fa' }}>
            <h4>Scan Result</h4>
            <p><strong>Type:</strong> {scanResult.type}</p>
            {scanResult.type === 'product' && (
              <>
                <p><strong>Product:</strong> {scanResult.product.name}</p>
                <p><strong>New Stock:</strong> {scanResult.newStock}</p>
              </>
            )}
          </div>
        )}
      </div>

      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px' }}>
        <h3>Products Inventory</h3>
        <div>
          {products.map(product => (
            <div key={product._id} style={{ 
              border: '1px solid #ccc', 
              padding: '15px', 
              margin: '10px 0',
              borderRadius: '5px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <h4>{product.name}</h4>
                  <p><strong>Stock:</strong> {product.stock}</p>
                  <p><strong>Minimum Stock:</strong> {product.minStockLevel}</p>
                  <p><strong>Barcode:</strong> {product.barcode || 'Not generated'}</p>
                  
                  <div style={{ marginTop: '10px' }}>
                    <input
                      type="number"
                      defaultValue={product.stock}
                      onBlur={(e) => updateStock(product._id, parseInt(e.target.value))}
                      style={{ padding: '5px', width: '80px', marginRight: '10px' }}
                    />
                    <button 
                      onClick={() => updateStock(product._id, product.stock)}
                      style={{ 
                        padding: '5px 10px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px'
                      }}
                    >
                      Update Stock
                    </button>
                  </div>
                </div>
                
                <div>
                  {!product.barcode ? (
                    <button 
                      onClick={() => generateBarcode(product._id)}
                      style={{ 
                        padding: '8px 12px',
                        backgroundColor: '#17a2b8',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px'
                      }}
                    >
                      Generate Barcode
                    </button>
                  ) : (
                    <BarcodeDisplay 
                      barcodeData={product.barcode} 
                      productName={product.name} 
                    />
                  )}
                </div>
              </div>
              
              {product.stock < product.minStockLevel && (
                <div style={{ 
                  backgroundColor: '#fff3cd', 
                  border: '1px solid #ffeaa7', 
                  padding: '10px', 
                  marginTop: '10px',
                  borderRadius: '3px'
                }}>
                  <p style={{ color: '#856404', margin: 0 }}>⚠️ LOW STOCK ALERT!</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Inventory;