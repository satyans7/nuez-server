// siteToDevice.js

import { getSiteDetails, getDevicesForSite } from '../client/client.js';

const siteIdDisplay = document.getElementById('site-id-display');
const allDevicesContainer = document.querySelector('.all-devices');

document.addEventListener('DOMContentLoaded', async () => {
    const siteId = getSiteIdFromURL();
    siteIdDisplay.textContent = siteId; 
    await viewAllDevices();
});

function getSiteIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('siteId');
}

async function viewAllDevices() {
    const siteId = getSiteIdFromURL();
    allDevicesContainer.innerHTML = '';

    try {
        // Fetch site details and devices for the site
        const siteDetails = await getSiteDetails(siteId);
        const devices = await getDevicesForSite(siteId);

        console.log("Site Details:", siteDetails);
        console.log("Devices:", devices);

        // Create and append device cards
        devices.forEach(device => {
            const deviceCard = document.createElement('div');
            deviceCard.className = 'card';
            
            const cardHeading = document.createElement('div');
            cardHeading.className = 'card-heading';
            
            const cardBody = document.createElement('div');
            cardBody.className = 'card-body';
            
            const deviceName = document.createElement('h3');
            deviceName.textContent = device.name;
            
            const deviceType = document.createElement('h4');
            deviceType.textContent = device.type;
            
            const moreDetailsButton = document.createElement('button');
            moreDetailsButton.className = 'fetch-device-data';
            moreDetailsButton.textContent = 'More Details';
            // Add event listener for device details if needed

            cardHeading.appendChild(deviceName);
            cardHeading.appendChild(moreDetailsButton);
            
            deviceCard.appendChild(cardHeading);
            cardBody.appendChild(deviceType);
            deviceCard.appendChild(cardBody);
            
            allDevicesContainer.appendChild(deviceCard);
        });
    } catch (error) {
        console.error('Error fetching devices data:', error);
        allDevicesContainer.innerHTML = '<p>Error fetching devices data. Please try again later.</p>';
    }
}
