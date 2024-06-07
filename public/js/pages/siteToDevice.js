import {
    getDevicesData, getSiteDeviceMapping, getAllConsumers, getSiteConsumerMapping, getSitesData, updateSiteDataOnServer, deleteSiteToDeviceMapping ,registerDevice, getConsumerDeviceMapping } from '../client/client.js';

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
const editBtn = document.getElementById('edit-profile');
const editTab = document.getElementById('edit-form-container');
const updateBtn = document.getElementById('update-button');
const site = getCurrentSite();
const deregisterForm= document.getElementById('deregister-device-form');
const unassignedDevicesLink = document.getElementById('unassigned-devices-link');
const unassignedDevicesContainer = document.getElementById('unassigned-devices-list');

const title = document.createElement('h1');
title.textContent = `Welcome, ${site}`;
headingText.appendChild(title);

const currentid = document.createElement('h1');
currentid.textContent = `Id : ${site}`;
currentSite.appendChild(currentid);

await viewAlldevices();

registerBtn.addEventListener('click', () => {
    toggleVisibility('register');
    const button = document.getElementById('register-id');
button.addEventListener('click', async(event) => {
    event.preventDefault();
    const deviceid= document.getElementById('register-device-id').value;
    const siteid= getCurrentSite();
    const devicedata= {
        "device" : deviceid
    };
        const jsonResponse = await registerDevice(devicedata,siteid);
  
        alert(jsonResponse.message);
          form.reset();  

})

});


deregisterBtn.addEventListener('click', () => {
    toggleVisibility('deregister');
});

editBtn.addEventListener('click', async () => {
    await setForm();
    toggleVisibility('edit');
});

updateBtn.addEventListener('click', async () => {
    await updateSiteInfo();
});

deviceTab.addEventListener('click', async () => {
    await viewAlldevices();
});

consumerTab.addEventListener('click', async () => {
    await viewAllconsumers();
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
    editTab.style.display = 'none';
    unassignedDevicesContainer.style.display = 'none'; // Hide unassigned devices container

    if (section === 'register') {
        registerTab.style.display = 'block';
    } else if (section === 'deregister') {
        deregisterTab.style.display = 'block';
    } else if (section === 'edit') {
        editTab.style.display = 'block';
    } else if (section === 'unassigned-devices') { // New section
        unassignedDevicesContainer.style.display = 'block';
    }
}

async function setForm() {
    const val = await getSitesData();
    let currentSitename = document.getElementById('edit-name');
    currentSitename.value = val[site].name;
    let currentSiteLocation = document.getElementById('edit-location');
    currentSiteLocation.value = val[site].location;
}

async function viewAlldevices() {
    toggleVisibility();
    alldevicesContainer.style.display = 'flex';
    const devicesData = await getDevicesData();
    const sitesdevicesMapping = await getSiteDeviceMapping();

    if (!sitesdevicesMapping[site]) {
        console.error(`No devices found for Site ID: ${site}`);
        alldevicesContainer.innerHTML = '<p>No devices found for this site.</p>';
        return;
    }

    const devices = sitesdevicesMapping[site];
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
    const consumersData = await getAllConsumers();
    const sitesconsumersMapping = await getSiteConsumerMapping();

    if (!sitesconsumersMapping[site]) {
        console.error(`No consumers found for Site ID: ${site}`);
        allConsumerContainer.innerHTML = '<p>No consumers found for this site.</p>';
        return;
    }

    const consumers = sitesconsumersMapping[site];
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
        const adminId = getCurrentAdmin();
        const route = `/api/consumer-dashboard/${key}?adminId=${adminId}`;
        console.log(`Redirecting to: ${route}`);  // Log the route for debugging
        window.location.href = route;  // Ensure the redirection logic is executed
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
function getCurrentAdmin(){
    const url= new URL(window.location.href);
    const searchParams= new URLSearchParams(url.search);
    return searchParams.get('adminId');
}
async function updateSiteInfo() {
    const val = await getSitesData();
    const newData = {
        name: document.getElementById('edit-name').value,
        location: document.getElementById('edit-location').value
    }
    try {
        const response = await updateSiteDataOnServer(newData, site);
        alert(response.message);
    } catch (error) {
        console.error('Error updating user:', error);
        alert('Error in Updating Info. Please try again.');
    }
    setForm();
}

/*document.getElementById('deregister-device-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const deviceId = document.getElementById('deregister-device-id').value; 

    
    const sitesDeviceMapping = await getSiteDeviceMapping();
    if (sitesDeviceMapping[site].includes(deviceId)) {
        try {
            const response = await deleteSiteToDeviceMapping(site);
            alert(`Device ID ${deviceId} deregistered successfully.`);
            await viewAlldevices();
        } catch (error) {
            console.error('Error deregistering device:', error);
            alert(`Error in deregistering device: ${error.message}`);
        }
    } else {
        alert(`No device with ID ${deviceId} found.`);
    }
});
*/
document.getElementById('deregister-device-form').addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const deviceId = document.getElementById('deregister-device-id').value;
    const device={
        device: deviceId
    }

  
    try {
      const response = await deleteSiteToDeviceMapping(site,device);
      viewAlldevices();
    alert(response.message);
    deregisterForm.reset();
    
    } catch (error) {
      console.error('Error deregistering device:', error);
      alert(`${error.message}`);
    }
  });
  


// UNASSIGNED DEVICES

unassignedDevicesLink.addEventListener('click', async () => {
    toggleVisibility('unassigned-devices');
    await viewUnassignedDevices();
});

async function viewUnassignedDevices() {
    const siteToDeviceMapping = await getSiteDeviceMapping(); // Get device mapping for the current site
    const consumerToDeviceMapping = await getConsumerDeviceMapping(); // Get consumer device mapping for all users
    const siteConsumerMapping = await getSiteConsumerMapping(); // Get consumer mapping for the current site

    unassignedDevicesContainer.innerHTML = ''; // Clear previous content

    const devices = siteToDeviceMapping[site] || []; // Get devices for the current site

    // Create the table structure
    const table = document.createElement('table');
    table.id = 'unassigned-devices-table';
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    // Create the table header row
    const headerRow = document.createElement('tr');
    const deviceIdHeader = document.createElement('th');
    deviceIdHeader.textContent = 'Device ID';
    const actionHeader = document.createElement('th');
    actionHeader.textContent = 'Action';

    headerRow.appendChild(deviceIdHeader);
    headerRow.appendChild(actionHeader);
    thead.appendChild(headerRow);

    // Iterate through the devices and create table rows for unassigned devices
    devices.forEach((deviceId, index) => {
        if (!isDeviceAssigned(deviceId, consumerToDeviceMapping, siteConsumerMapping)) {
            const row = createUnassignedDeviceRow(deviceId, index);
            tbody.appendChild(row);
        }
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    unassignedDevicesContainer.appendChild(table);
}

function isDeviceAssigned(deviceId, consumerToDeviceMapping, siteConsumerMapping) {
    const consumers = siteConsumerMapping[site] || []; // Get consumers of the current site

    // Iterate over the consumers and check if the device is assigned to any of them
    for (const consumerId of consumers) {
        if (consumerToDeviceMapping[consumerId]?.includes(deviceId)) {
            return true; // Device is assigned to a consumer of the current site
        }
    }
    return false; // Device is not assigned to any consumer of the current site
}

function createUnassignedDeviceRow(deviceId, index) {
    const row = document.createElement('tr');
    row.id = `unassigned-device-row-${index}`;

    const deviceIdCell = document.createElement('td');
    deviceIdCell.id = `unassigned-device-id-${index}`;
    deviceIdCell.textContent = deviceId;
    row.appendChild(deviceIdCell);

    const actionCell = document.createElement('td');
    actionCell.id = `unassigned-device-action-${index}`;
    const assignButton = document.createElement('button');
    assignButton.id = `assign-button-${index}`; // Ensure this ID matches the CSS
    assignButton.textContent = 'Assign';
    assignButton.addEventListener('click', () => {
        // Implement assign functionality here
    });

    const deleteButton = document.createElement('button');
    deleteButton.id = `delete-button-${index}`; // Ensure this ID matches the CSS
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => {
        // Implement delete functionality here
    });

    actionCell.appendChild(assignButton);
    actionCell.appendChild(deleteButton);
    row.appendChild(actionCell);

    return row;
}
