import React, { useState, useEffect } from 'react';
import api from '../services/api';

const ProductList = ({ onAddToOrder }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      setError('Failed to load products');
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading products...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Menu</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {products.map(product => (
          <div key={product._id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '5px' }}>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p><strong>Price: ${product.price}</strong></p>
            <p>Stock: {product.stock}</p>
            <div style={{ marginTop: '10px' }}>
              <button 
                onClick={() => onAddToOrder(product)}
                disabled={product.stock === 0}
                style={{ 
                  marginRight: '10px', 
                  padding: '8px 12px',
                  backgroundColor: product.stock === 0 ? '#ccc' : '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px'
                }}
              >
                Add to Order
              </button>
              {product.customizable && (
                <button 
                  onClick={() => onAddToOrder(product, true)}
                  style={{ 
                    padding: '8px 12px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px'
                  }}
                >
                  Customize
                </button>
              )}
            </div>
            {product.stock === 0 && (
              <p style={{ color: 'red', marginTop: '5px' }}>Out of stock</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;