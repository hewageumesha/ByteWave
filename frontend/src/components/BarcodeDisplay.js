import React from 'react';

const BarcodeDisplay = ({ barcodeData, productName }) => {
  return (
    <div style={{ 
      border: '1px solid #ccc', 
      padding: '10px', 
      margin: '10px',
      fontFamily: 'monospace',
      textAlign: 'center'
    }}>
      <h4>{productName} - Barcode</h4>
      <div style={{ 
        backgroundColor: '#f5f5f5', 
        padding: '15px',
        borderRadius: '5px'
      }}>
        <pre style={{ margin: 0, fontSize: '16px' }}>{barcodeData}</pre>
      </div>
      <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
        Scan this code at the inventory station
      </p>
    </div>
  );
};

export default BarcodeDisplay;