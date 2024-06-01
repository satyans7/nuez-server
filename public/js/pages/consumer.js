import { getDevicesData, getConsumerDeviceMapping, getAllAdmins } from '../client/client.js';

const alldevicesContainer = document.querySelector('.all-devices');
const headingText = document.getElementById('heading');
const currentConsumer = document.getElementById('consumer-id');

const title = document.createElement('h1');
title.textContent = `Welcome, ${getCurrentId()}`;
headingText.appendChild(title);

const currentid = document.createElement('h1');
currentid.textContent = `Id : ${getCurrentId()}`;
currentConsumer.appendChild(currentid);

document.addEventListener('DOMContentLoaded', async () => {
    const userId = getCurrentId();
    const queryParams = new URLSearchParams(window.location.search);
    const adminId = queryParams.get('adminId');
    
    if (adminId) {
        // Show admin buttons if the adminId query parameter exists
        showAdminButtons();
    }

    await viewAlldevices();
});

function getCurrentId() {
    const fullUrl = window.location.href;
    const url = new URL(fullUrl);
    const pathname = url.pathname;
    const segments = pathname.split('/');
    const siteId = segments[segments.length - 1];
    return siteId;
}

function showAdminButtons() {
    const buttonContainer = document.getElementById('button-container');
    const registerButton = document.createElement('button');
    registerButton.textContent = 'Register Device';
    registerButton.id = 'register-consumer';
    registerButton.addEventListener('click', () => {
        // Registration logic
    });

    const deregisterButton = document.createElement('button');
    deregisterButton.textContent = 'Deregister Device';
    deregisterButton.id = 'deregister-consumer';
    deregisterButton.addEventListener('click', () => {
        // Deregistration logic
    });

    buttonContainer.appendChild(registerButton);
    buttonContainer.appendChild(deregisterButton);
}

async function viewAlldevices() {
    const ConsumerId = getCurrentId();
    const devicesData = await getDevicesData();
    console.log(devicesData);
    const consumerdeviceMapping = await getConsumerDeviceMapping();
    console.log(consumerdeviceMapping);
    let devices = [];
    devices = consumerdeviceMapping[ConsumerId];
    console.log(devices);
    alldevicesContainer.innerHTML = '';
    devices.forEach(key => {
        const device = devicesData[key];
        if (device) {
            showAllDevices(device, key);
        }
    });
}

async function showAllDevices(device, key) {
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
    moreDetailsButton.addEventListener('click', () => {
        const route = `/api/device-profile/${key}`;
        window.location.href = route;
    });
    cardHeading.appendChild(deviceName);
    cardHeading.appendChild(moreDetailsButton);
    deviceCard.appendChild(cardHeading);
    cardBody.appendChild(deviceLocation);
    deviceCard.appendChild(cardBody);
    alldevicesContainer.appendChild(deviceCard);
}
