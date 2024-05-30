import { getDevicesData, getSiteDeviceMapping } from '../client/client.js';

const alldevicesContainer = document.querySelector('.all-devices');
const registerTab = document.getElementById('register-form-container');
const deregisterTab = document.getElementById('deregister-form-container');
const registerBtn = document.getElementById('register-device-button');
const deregisterBtn = document.getElementById('deregister-device-button');
const viewdevicesBtn = document.getElementById('view-device-button')
const headingText = document.getElementById('heading');
const currentSite = document.getElementById('site-id')

const title = document.createElement('h1');
title.textContent = `Welcome, ${getCurrentSite()}`
headingText.appendChild(title)

const currentid = document.createElement('h1');
currentid.textContent = `Id : ${getCurrentSite()}`
currentSite.appendChild(currentid)


registerBtn.addEventListener('click', () => {
    alldevicesContainer.style.display = 'none';
    deregisterTab.style.display = 'none';
    registerTab.style.display = 'block';
})

deregisterBtn.addEventListener('click', () => {
    alldevicesContainer.style.display = 'none';
    registerTab.style.display = 'none';
    deregisterTab.style.display = 'block';
})

viewdevicesBtn.addEventListener('click', async () => {
    await viewAlldevices();
})

document.addEventListener('DOMContentLoaded', async () => {
    await viewAlldevices();

});

function getCurrentSite() {
    const fullUrl = window.location.href;
    const url = new URL(fullUrl);
    const pathname = url.pathname;
    const segments = pathname.split('/');
    const siteId = segments[segments.length - 1];
    return siteId;
};



async function viewAlldevices() {
    deregisterTab.style.display = 'none';
    registerTab.style.display = 'none';
    alldevicesContainer.style.display = 'flex';
    const SiteId = getCurrentSite();
    console.log(SiteId)
    const devicesData = await getDevicesData();
    const sitesdevicesMapping = await getSiteDeviceMapping();
    let devices = [];
    devices = sitesdevicesMapping[SiteId];
    alldevicesContainer.innerHTML = '';
    devices.forEach(key => {
        const device = devicesData[key];
        if (device) {
            const deviceCard = document.createElement('div');
            deviceCard.className = 'card';
            const cardHeading = document.createElement('div');
            cardHeading.className = 'card-heading';
            const cardBody = document.createElement('div');
            cardBody.className = 'card-body';
            const deviceName = document.createElement('h3');
            deviceName.textContent = device.name;
            const deviceLocation = document.createElement('h4');
            deviceLocation.textContent = device.location;
            const moreDetailsButton = document.createElement('button');
            moreDetailsButton.id = 'fetch-device-data';
            moreDetailsButton.textContent = 'More Details';
            cardHeading.appendChild(deviceName);
            cardHeading.appendChild(moreDetailsButton);
            deviceCard.appendChild(cardHeading);
            cardBody.appendChild(deviceLocation);
            deviceCard.appendChild(cardBody)
            alldevicesContainer.appendChild(deviceCard);
        }
    });
}


