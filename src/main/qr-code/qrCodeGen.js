const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');
const controller = require("../controller/controller.js");

const directoryPath = path.join(__dirname, 'qr_codes_generated');

// Ensure the directory exists or create it if it doesn't
if (!fs.existsSync(directoryPath)) {
  fs.mkdirSync(directoryPath);
}


let deviceIds=Object.keys(allDeviceData);

  // URL of the API endpoint with query parameters
  const apiUrl = `http://localhost:4000/device-info/${deviceId}`;

// Specify the directory where you want to save the QR code image

// Define the complete file path including the file name
const filePath = path.join(directoryPath, 'api_qr_code.png');

// Generate QR code and save as image
QRCode.toFile(filePath, apiUrl, {
  color: {
    dark: '#000',  // QR code color
    light: '#FFF'  // Background color
  }
}, function (err) {
  if (err) throw err;
  console.log(`QR code generated and saved as ${filePath}`);
});
