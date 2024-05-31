import { getDevicesData, getSiteDeviceMapping, getAllConsumers, getSiteConsumerMapping } from '../client/client.js';

const alldevicesContainer = document.querySelector('#device-list');
const allConsumerContainer = document.querySelector('#consumer-list');
const registerTab = document.getElementById('register-form-container');
const deregisterTab = document.getElementById('deregister-form-container');
const registerBtn = document.getElementById('register-device-button');
const deregisterBtn = document.getElementById('deregister-device-button');
const headingText = document.getElementById('heading');
const currentSite = document.getElementById('site-id');
const deviceTab = document.getElementById('device-tab');
const consumerTab = document.getElementById('consumer-tab');

const title = document.createElement('h1');
title.textContent = `Welcome, ${getCurrentSite()}`;
headingText.appendChild(title);

const currentid = document.createElement('h1');
currentid.textContent = `Id : ${getCurrentSite()}`;
currentSite.appendChild(currentid);

registerBtn.addEventListener('click', () => {
    toggleVisibility('register');
});

deregisterBtn.addEventListener('click', () => {
    toggleVisibility('deregister');
});

deviceTab.addEventListener('click', async () => {
    await viewAlldevices();
});

consumerTab.addEventListener('click', async () => {
    await viewAllconsumers();
});

document.addEventListener('DOMContentLoaded', async () => {
    await viewAlldevices();
});

function getCurrentSite() {
    const fullUrl = window.location.href;
    const url = new URL(fullUrl);
    const pathname = url.pathname;
    const segments = pathname.split('/');
    return segments[segments.length - 1];
}

function toggleVisibility(section) {
    alldevicesContainer.style.display = 'none';
    allConsumerContainer.style.display = 'none';
    registerTab.style.display = 'none';
    deregisterTab.style.display = 'none';

    if (section === 'register') {
        registerTab.style.display = 'block';
    } else if (section === 'deregister') {
        deregisterTab.style.display = 'block';
    }
}

async function viewAlldevices() {
    toggleVisibility();
    alldevicesContainer.style.display = 'flex';

    const SiteId = getCurrentSite();
    const devicesData = await getDevicesData();
    const sitesdevicesMapping = await getSiteDeviceMapping();

    if (!sitesdevicesMapping[SiteId]) {
        console.error(`No devices found for Site ID: ${SiteId}`);
        alldevicesContainer.innerHTML = '<p>No devices found for this site.</p>';
        return;
    }

    const devices = sitesdevicesMapping[SiteId];
    alldevicesContainer.innerHTML = '';

    devices.forEach(key => {
        const device = devicesData[key];
        if (device) {
            const deviceCard = createDeviceCard(device, key);
            alldevicesContainer.appendChild(deviceCard);
        } else {
            console.error(`Device not found for key: ${key}`);
        }
    });
}

function createDeviceCard(device, key) {
    const deviceCard = document.createElement('div');
    deviceCard.className = 'card';

    const cardHeading = document.createElement('div');
    cardHeading.className = 'card-heading';

    const deviceName = document.createElement('h3');
    deviceName.textContent = device.name;

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

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    const deviceLocation = document.createElement('h4');
    deviceLocation.textContent = device.location;

    cardBody.appendChild(deviceLocation);
    deviceCard.appendChild(cardBody);

    return deviceCard;
}

async function viewAllconsumers() {
    toggleVisibility();
    allConsumerContainer.style.display = 'flex';

    const SiteId = getCurrentSite();
    const consumersData = await getAllConsumers();
    const sitesconsumersMapping = await getSiteConsumerMapping();

    if (!sitesconsumersMapping[SiteId]) {
        console.error(`No consumers found for Site ID: ${SiteId}`);
        allConsumerContainer.innerHTML = '<p>No consumers found for this site.</p>';
        return;
    }

    const consumers = sitesconsumersMapping[SiteId];
    allConsumerContainer.innerHTML = '';

    consumers.forEach(key => {
        const consumer = consumersData[key];
        if (consumer) {
            const consumerCard = createConsumerCard(consumer, key);
            allConsumerContainer.appendChild(consumerCard);
        } else {
            console.error(`Consumer not found for key: ${key}`);
        }
    });
}

function createConsumerCard(consumer, key) {
    const consumerCard = document.createElement('div');
    consumerCard.className = 'card';

    const cardHeading = document.createElement('div');
    cardHeading.className = 'card-heading';

    const consumerName = document.createElement('h3');
    consumerName.textContent = consumer.name;

    const moreDetailsButton = document.createElement('button');
    moreDetailsButton.id = 'fetch-consumer-data';
    moreDetailsButton.textContent = 'More Details';
    moreDetailsButton.addEventListener('click', () => {
        const route = `/api/consumer-dashboard/${key}`;
        window.location.href = route;
    });

    cardHeading.appendChild(consumerName);
    cardHeading.appendChild(moreDetailsButton);
    consumerCard.appendChild(cardHeading);

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    const consumerLocation = document.createElement('h4');
    consumerLocation.textContent = key;

    cardBody.appendChild(consumerLocation);
    consumerCard.appendChild(cardBody);

    return consumerCard;
}
