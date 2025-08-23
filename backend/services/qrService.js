const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

const generateQRCode = async (orderId, orderData) => {
  try {
    // Create QR code data
    const qrData = JSON.stringify({
      orderId: orderId.toString(),
      total: orderData.total,
      pickupTime: orderData.pickupTime,
      items: orderData.items.map(item => ({
        product: item.product.toString(),
        quantity: item.quantity
      }))
    });

    // Generate QR code image
    const qrCodePath = path.join(__dirname, '../uploads/qrcodes', `${orderId}.png`);
    const qrCodeDir = path.dirname(qrCodePath);
    
    if (!fs.existsSync(qrCodeDir)) {
      fs.mkdirSync(qrCodeDir, { recursive: true });
    }

    await QRCode.toFile(qrCodePath, qrData, {
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      width: 300,
      margin: 1
    });

    return {
      qrCode: qrData,
      qrCodeImage: `/uploads/qrcodes/${orderId}.png`
    };
  } catch (error) {
    console.error('QR code generation error:', error);
    
    // Fallback: return QR code data without image
    return {
      qrCode: JSON.stringify({
        orderId: orderId.toString(),
        total: orderData.total,
        pickupTime: orderData.pickupTime
      }),
      qrCodeImage: null
    };
  }
};

// Generate QR code as data URL for frontend
const generateQRCodeDataURL = async (data) => {
  try {
    return await QRCode.toDataURL(data);
  } catch (error) {
    console.error('QR code data URL generation error:', error);
    return null;
  }
};

module.exports = { generateQRCode, generateQRCodeDataURL };