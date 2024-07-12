import { getDeviceData } from "../client/client.js";

document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const deviceId = window.location.pathname.split('/').pop();
  console.log(deviceId);
  
  try {
    const data = await getDeviceData(deviceId);
    console.log(data);

    if (deviceId && data) {
      document.getElementById('device-id').textContent = deviceId;
      document.getElementById('device-version').textContent = data.version;
      document.getElementById('device-location').textContent = data.location;
      document.getElementById('device-owner').textContent = data.owner;
      document.getElementById('device-site').textContent = data.site;
    } else {
      document.getElementById('error').textContent = 'Invalid device info';
    }
  } catch (error) {
    console.error('Error fetching device data:', error);
    document.getElementById('error').textContent = 'Failed to load device info';
  }
});
