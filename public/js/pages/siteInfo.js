import { getSiteData } from "../client/client.js";

document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const siteId = window.location.pathname.split('/').pop();
  console.log(siteId);
  
  try {
    const data = await getSiteData(siteId);
    console.log(data);

    if (siteId && data) {
      document.getElementById('site-id').textContent = siteId;
      document.getElementById('site-admin').textContent = data.admin;
      document.getElementById('site-location').textContent = data.location;
    } else {
      document.getElementById('error').textContent = 'Invalid site info';
    }
  } catch (error) {
    console.error('Error fetching site data:', error);
    document.getElementById('error').textContent = 'Failed to load site info';
  }
});
