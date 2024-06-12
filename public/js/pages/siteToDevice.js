
import {
    getDevicesData, getSiteDeviceMapping, getAllConsumers, getSiteConsumerMapping, getSitesData, updateSiteDataOnServer, deleteSiteToDeviceMapping ,registerDevice, getConsumerDeviceMapping, assignDeviceToUser, 
    deregisterConsumer,
    registerConsumer} from '../client/client.js';

const alldevicesContainer = document.querySelector('#device-list');
const allConsumerContainer = document.querySelector('#consumer-list');
const registerTab = document.getElementById('register-form-container');
const deregisterTab = document.getElementById('deregister-form-container');
const deregisterConsumerTab = document.getElementById('deregister-consumer-container')
const registerConsumerTab = document.getElementById('register-consumer-container')
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
const deregisterDeviceForm= document.getElementById('deregister-device-form');
const registerDeviceForm = document.getElementById('register-device-form');
const registerConsumerForm = document.getElementById('register-consumer-form');
const deregisterConsumerForm = document.getElementById('deregister-consumer-form');
const unassignedDevicesLink = document.getElementById('unassigned-devices-link');
const unassignedDevicesContainer = document.getElementById('unassigned-devices-list');
document.getElementById('user-search-input').addEventListener('input', filterUsers);
document.getElementById('cancel-search-btn').addEventListener('click', cancelSearch);
document.getElementById('assign-user-btn').addEventListener('click', assignUser);
const firmwareVersionContainer = document.getElementById('firmware-version-list');

const title = document.createElement('h1');
title.textContent = `Welcome, ${site}`;
headingText.appendChild(title);

const currentid = document.createElement('h1');
currentid.textContent = `Id : ${site}`;
currentSite.appendChild(currentid);

document.addEventListener('DOMContentLoaded', async()=>{
    await viewAlldevices();
    registerBtn.addEventListener('click', () => {
        toggleVisibility('register');
    });
    deregisterBtn.addEventListener('click', () => {
        toggleVisibility('deregister');
    });

})


editBtn.addEventListener('click', async () => {
    await setForm();
    toggleVisibility('edit');
});

updateBtn.addEventListener('click', async () => {
    await updateSiteInfo();
});

deviceTab.addEventListener('click', async () => {
    await viewAlldevices();
    registerBtn.addEventListener('click', () => {
        toggleVisibility('register');
    });

    deregisterBtn.addEventListener('click', () => {
        toggleVisibility('deregister');
    });
});

consumerTab.addEventListener('click', async () => {
    await viewAllconsumers();
    registerBtn.addEventListener('click', () => {
        toggleVisibility('register-consumer');   
    });

    deregisterBtn.addEventListener('click', () => {
        toggleVisibility('deregister-consumer');        
    });
});

function getCurrentSite() {
    const fullUrl = window.location.href;
    const url = new URL(fullUrl);
    const pathname = url.pathname;
    const segments = pathname.split('/');
    return segments[segments.length - 1];
}

function toggleVisibility(section) {
    const sections = [
        alldevicesContainer, 
        allConsumerContainer, 
        registerTab, 
        deregisterTab, 
        editTab, 
        registerConsumerTab, 
        deregisterConsumerTab, 
        unassignedDevicesContainer, 
        firmwareVersionContainer
    ];

    sections.forEach(container => container.style.display = 'none');

    if (section === 'register') {
        registerTab.style.display = 'block';
    } else if (section === 'deregister') {
        deregisterTab.style.display = 'block';
    } else if (section === 'register-consumer') {
        registerConsumerTab.style.display = 'block';
    } else if (section === 'deregister-consumer') {
        deregisterConsumerTab.style.display = 'block';
    } else if (section === 'edit') {
        editTab.style.display = 'block';
    } else if (section === 'unassigned-devices') {
        unassignedDevicesContainer.style.display = 'block';
    } else if (section === 'firmware-version') {
        firmwareVersionContainer.style.display = 'block';
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

// REGISTER DEVICE
registerDeviceForm.addEventListener('submit', async (event) =>{
    event.preventDefault();
    const deviceid = document.getElementById('register-device-id').value;
    const devicedata = {
        "device": deviceid
    };
    const jsonResponse = await registerDevice(devicedata, site);
    viewAlldevices();
    alert(jsonResponse.message);
    registerDeviceForm.reset();

})

document.getElementById('register-cancel-button').addEventListener('click', () => {
    registerDeviceForm.display='none';
    viewAlldevices();
});


//DEREGISTER DEVICE
deregisterDeviceForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const deviceId = document.getElementById('deregister-device-id').value;
    console.log(deviceId)
    const device={
        device: deviceId
    }
    try {
      const response = await deleteSiteToDeviceMapping(site,device);
      viewAlldevices();
    alert(response.message);
    deregisterDeviceForm.reset();
    
    } catch (error) {
      console.error('Error deregistering device:', error);
      alert(`${error.message}`);
    }
});

document.getElementById('deregister-cancel-button').addEventListener('click', () => {
    deregisterDeviceForm.display='none';
    viewAlldevices();
});
  
// REGISTER CONSUMER
registerConsumerForm.addEventListener('submit', async (event) =>{
    event.preventDefault();
    const consumerId = document.getElementById('register-consumer-id').value;
    const consumer = {
        consumer : consumerId
    };
    console.log(consumer)
    const jsonResponse = await registerConsumer(site, consumer);
    viewAllconsumers();
    alert(jsonResponse.message);
    registerConsumerForm.reset();
})

// DEREGISTER CONSUMER
deregisterConsumerForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const consumerId = document.getElementById('deregister-consumer-id').value;
    const consumer = {
        consumer: consumerId
    }
    try {
        const response = await deregisterConsumer(site, consumer);
        viewAllconsumers();
        alert(response.message);
        deregisterConsumerForm.reset();

    } catch (error) {
        console.error('Error deregistering consumer:', error);
        alert(`${error.message}`);
    }
})



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

function isDeviceAssigned(deviceId, consumerToDeviceMapping, siteConsumerMapping, site) {
    const consumers = siteConsumerMapping[site] || []; // Get consumers of the current site

    // Iterate over the consumers and check if the device is assigned to any of them
    for (const consumerId of consumers) {
        if (consumerToDeviceMapping[consumerId]?.includes(deviceId)) {
            return true; // Device is assigned to a consumer of the current site
        }
    }

    // Check if the device is assigned to any users mapped to other sites
    for (const otherSite of Object.keys(siteConsumerMapping)) {
        if (otherSite !== site) {
            const otherSiteConsumers = siteConsumerMapping[otherSite] || [];
            for (const consumerId of otherSiteConsumers) {
                if (consumerToDeviceMapping[consumerId]?.includes(deviceId)) {
                    return true; // Device is assigned to a consumer of another site
                }
            }
        }
    }

    return false; // Device is not assigned to any consumer of the current site or other sites
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
        showUserSearch(deviceId);
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


//SEARCH 
let selectedDeviceId;
let users=[];

async function showUserSearch(deviceId){
    selectedDeviceId = deviceId;
    document.getElementById('user-search-container').style.display='block';
    const currentSite= await getCurrentSite();
    const siteConsumerMapping= await getSiteConsumerMapping();
    users= siteConsumerMapping[currentSite] || [];
    populateUserList(users);

    // Add event listener for clicking outside the search box
    document.addEventListener('click', handleClickOutside, true);
}

function populateUserList(userList){
    const userListElem=document.getElementById('user-list');
    userListElem.innerHTML='';
    userList.forEach(user => {
        const li = document.createElement('li');
        li.textContent=user;
        li.onclick=() => selectedUser(user);
        userListElem.appendChild(li);
    });
}

function selectedUser(user){
    document.getElementById('user-search-input').value=user;
    document.getElementById('user-list').innerHTML='';
}

function filterUsers() {
    const query = document.getElementById('user-search-input').value.toLowerCase(); // ADDED
    const filteredUsers = users.filter(user => user.toLowerCase().includes(query)); // ADDED
    populateUserList(filteredUsers); // ADDED
}

async function assignUser() {
    const selectedUser = document.getElementById('user-search-input').value;
    const consumerToDeviceMapping= await getConsumerDeviceMapping();
    if (selectedUser) {
        if (selectedDeviceId) {
            // Check if the user already exists in the mapping
            if (consumerToDeviceMapping[selectedUser]) {
                // Check if the device is already assigned to the user
                if (!consumerToDeviceMapping[selectedUser].includes(selectedDeviceId)) {
                    // Add the device to the existing user without modifying the existing mappings
                    consumerToDeviceMapping[selectedUser].push(selectedDeviceId);
                } else {
                    alert(`Device ${selectedDeviceId} is already assigned to user ${selectedUser}.`);
                    return; // Exit the function if the device is already assigned to the user
                }
            } 

            alert(`Assigning user ${selectedUser} to device ${selectedDeviceId}`);

            // Make API call to update backend (if needed)
            const obj ={
                device: selectedDeviceId
            }
            await assignDeviceToUser(selectedUser,obj);
            viewUnassignedDevices();
            document.getElementById('user-search-container').style.display = 'none';
            document.removeEventListener('click', handleClickOutside, true);
        } else {
            alert('Please select a device.');
        }
    } else {
        alert('Please select a user to assign.');
    }
}


function handleClickOutside(event){
    const userSearchContainer= document.getElementById('user-search-container');
    if(!userSearchContainer.contains(event.target)){
        cancelSearch();
    }
}

function cancelSearch(){
    document.getElementById('user-search-container').style.display = 'none';
    document.removeEventListener('click', handleClickOutside, true);
}



//
// Add an event listener to the firmware version link/button
document.getElementById('firmware-version-link').addEventListener('click', function() {
    toggleVisibility('firmware-version');
    fetchDeviceIdsWithFirmware(); // Fetch device IDs and their firmware versions
});


// Function to fetch device IDs and their firmware versions
function fetchDeviceIdsWithFirmware() {
    getSiteDeviceMapping().then(siteDeviceMapping => {
        const currentSiteId = getCurrentSite();
        const deviceIds = siteDeviceMapping[currentSiteId] || [];
        const tbody = document.getElementById('firmware-table-body');
        tbody.innerHTML = ''; // Clear any existing rows
        // Create header row for firmware versions
        const headerRow = document.createElement('tr');
        const deviceIdHeaderCell = document.createElement('th');
        deviceIdHeaderCell.textContent = 'Device ID';
        headerRow.appendChild(deviceIdHeaderCell);
        const firmwareHeaderCell = document.createElement('th');
        firmwareHeaderCell.textContent = 'Firmware Version';
        headerRow.appendChild(firmwareHeaderCell);
        tbody.appendChild(headerRow);
        // Iterate through device IDs to fetch and display firmware versions
        deviceIds.forEach(deviceId => {
            const row = document.createElement('tr');
            const deviceIdCell = document.createElement('td');
            deviceIdCell.textContent = deviceId;
            row.appendChild(deviceIdCell);
            // Fetch firmware version for each device ID
            fetchFirmwareVersion(deviceId).then(firmwareVersion => {
                const firmwareCell = document.createElement('td');
                firmwareCell.textContent = firmwareVersion;
                row.appendChild(firmwareCell);
            });
            tbody.appendChild(row);
        });
    });
}

// Function to fetch firmware version for a device
function fetchFirmwareVersion(deviceId) {
    // Mock implementation, replace with actual data fetching logic
    return new Promise(resolve => {
        setTimeout(() => {
            // Simulating fetching firmware version
            const firmwareVersion = '1.0.0'; // Replace with actual firmware version
            resolve(firmwareVersion);
        }, 1000);
    });
}
