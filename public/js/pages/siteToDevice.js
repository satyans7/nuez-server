
import {
    getDevicesData, getSiteDeviceMapping, getAllConsumers, getSiteConsumerMapping, getSitesData, updateSiteDataOnServer, deleteSiteToDeviceMapping, registerDevice, getConsumerDeviceMapping, assignDeviceToUser,
    deregisterConsumer,
    registerConsumer
} from '../client/client.js';

const alldevicesContainer = document.querySelector('#device-list');
const allConsumerContainer = document.querySelector('#consumer-list');
const deregisterConsumerTab = document.getElementById('deregister-container')
const registerConsumerTab = document.getElementById('register-container')
const registerBtn = document.getElementById('register-button');
const deregisterBtn = document.getElementById('deregister-button');
const btnGroup = document.getElementById('button-grp')
const headingText = document.getElementById('heading');
const currentSite = document.getElementById('site-id');
const deviceTab = document.getElementById('device-tab');
const consumerTab = document.getElementById('consumer-tab');
const editBtn = document.getElementById('edit-profile');
const editTab = document.getElementById('edit-form-container');
const updateBtn = document.getElementById('update-button');
const registerConsumerForm = document.getElementById('register-consumer-form');
const deregisterConsumerForm = document.getElementById('deregister-consumer-form');
const unassignedDevicesLink = document.getElementById('unassigned-devices-link');
const unassignedDevicesContainer = document.getElementById('unassigned-devices-list');
const maintenanceTab = document.getElementById('device-maintenance-tab')
const maintenanceDevicesContainer = document.getElementById('maintenance-devices-list')
const firmwareVersionContainer = document.getElementById('firmware-version-list');

// Current Site Id
const site = getCurrentSiteId();

function getCurrentSiteId() {
    const fullUrl = window.location.href;
    const url = new URL(fullUrl);
    const pathname = url.pathname;
    const segments = pathname.split('/');
    return segments[segments.length - 1];
}

// Setting site Info

async function setInfo() {
    const title = document.createElement('h1');
    const siteInfo = await getSitesData();
    title.textContent = `Welcome, ${siteInfo[site].name}`;
    headingText.appendChild(title);

    const currentid = document.createElement('h1');
    currentid.textContent = `Id : ${site}`;
    currentSite.appendChild(currentid);

}

// On loading 

document.addEventListener('DOMContentLoaded', async () => {
    toggleVisibility();
    await setInfo();
    await viewAlldevices();
})


//Toggle visibility

function toggleVisibility() {
    const sections = [
        alldevicesContainer,
        allConsumerContainer,
        editTab,
        registerConsumerTab,
        deregisterConsumerTab,
        unassignedDevicesContainer,
        firmwareVersionContainer,
        maintenanceDevicesContainer,
        btnGroup
    ];

    sections.forEach(container => container.style.display = 'none');
}


// All Devices tab (Default) --------------------------------------------------------------------------//

deviceTab.addEventListener('click', async () => {
    await viewAlldevices();
});

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



// ALL CONSUMERS TAB ----------------------------------------------------------------------------//

consumerTab.addEventListener('click', async () => {
    await viewAllconsumers();
    btnGroup.style.display = 'flex';
    registerBtn.addEventListener('click', () => {
        toggleVisibility();
        registerConsumerTab.style.display = 'block';
        btnGroup.style.display = 'flex';
    });
    deregisterBtn.addEventListener('click', () => {
        toggleVisibility();
        deregisterConsumerTab.style.display = 'block';
        btnGroup.style.display = 'flex';
    });
});


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

function getCurrentAdmin() {
    const url = new URL(window.location.href);
    const searchParams = new URLSearchParams(url.search);
    return searchParams.get('adminId');
}

registerConsumerForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const consumerId = document.getElementById('register-consumer-id').value;
    const consumer = {
        consumer: consumerId
    };
    console.log(consumer)
    const jsonResponse = await registerConsumer(site, consumer);
    viewAllconsumers();
    alert(jsonResponse.message);
    registerConsumerForm.reset();
})

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


// DEVICE MAINTENANCE TAB----------------------------------------------------------------------------------------//

maintenanceTab.addEventListener('click', async () => {
    toggleVisibility();
    maintenanceDevicesContainer.style.display = 'block';
    await viewMaintenanceDevices();
})

async function viewMaintenanceDevices() {
    // Fetch device data and site-device mappings
    const devicesData = await getDevicesData();
    const sitesdevicesMapping = await getSiteDeviceMapping();

    // Create table elements
    const maintenanceTable = document.createElement('table');
    maintenanceTable.id = 'maintenance-devices-table';
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    // Create and append header row
    const headerRow = document.createElement('tr');
    const deviceIdHeader = document.createElement('th');
    deviceIdHeader.textContent = 'Device Name';
    const actionHeader = document.createElement('th');
    actionHeader.textContent = 'Action';
    const reasonHeader = document.createElement('th');
    reasonHeader.textContent = 'Reason';

    headerRow.appendChild(deviceIdHeader);
    headerRow.appendChild(actionHeader);
    headerRow.appendChild(reasonHeader);
    thead.appendChild(headerRow);

    // Get devices for the site
    const devices = sitesdevicesMapping[site];
    maintenanceDevicesContainer.innerHTML = '';

    devices.forEach(key => {
        const device = devicesData[key];
        if (device) {
            // Create row for each device
            const row = document.createElement('tr');
            const nameCell = document.createElement('td');
            nameCell.textContent = device.name;

            // Create action cell with two buttons
            const actionCell = document.createElement('td');
            const enterMaintenanceButton = document.createElement('button');
            enterMaintenanceButton.textContent = 'Enter Maintenance';
            enterMaintenanceButton.style.cursor = 'pointer';
            const exitMaintenanceButton = document.createElement('button');
            exitMaintenanceButton.textContent = 'Exit Maintenance';
            exitMaintenanceButton.style.background = 'red';
            exitMaintenanceButton.disabled = true; 
            exitMaintenanceButton.style.cursor = 'not-allowed'
            exitMaintenanceButton.style.opacity = 0.5


            actionCell.appendChild(enterMaintenanceButton);
            actionCell.appendChild(exitMaintenanceButton);

            const reasonCell = document.createElement('td');
            const reasonDropdown = document.createElement('select');
            const option1 = document.createElement('option');
            option1.value = '';
            option1.textContent = 'Select Reason';
            const option2 = document.createElement('option');
            option2.value = 'Battery Change';
            option2.textContent = 'Battery Change';
            const option3 = document.createElement('option');
            option3.value = 'Firmware Upgrade';
            option3.textContent = 'Firmware Upgrade';

            reasonDropdown.appendChild(option1);
            reasonDropdown.appendChild(option2);
            reasonDropdown.appendChild(option3);
            reasonCell.appendChild(reasonDropdown);

            enterMaintenanceButton.addEventListener('click', () => {
                if (reasonDropdown.value === '') {
                    alert('Please select a reason before entering maintenance.');
                } else {
                    alert(`${device.name} is under maintenance now.`);
                    exitMaintenanceButton.disabled = false; 
                    exitMaintenanceButton.style.cursor = 'pointer';
                    exitMaintenanceButton.style.opacity = 1;
                    enterMaintenanceButton.disabled = true;
                    enterMaintenanceButton.style.cursor = 'not-allowed';
                    enterMaintenanceButton.style.opacity = 0.5;
                }
            });

            exitMaintenanceButton.addEventListener('click', () => {
                if(confirm(`Do you want to exit the maintenance mode?`)){
                    enterMaintenanceButton.disabled = false;
                    enterMaintenanceButton.style.cursor = 'pointer';
                    enterMaintenanceButton.style.opacity = 1;
                    exitMaintenanceButton.disabled = true;
                    exitMaintenanceButton.style.cursor = 'not-allowed'
                    exitMaintenanceButton.style.opacity = 0.5
                    reasonDropdown.value = "";
                }
                
            });

            row.appendChild(nameCell);
            row.appendChild(actionCell);
            row.appendChild(reasonCell);
            tbody.appendChild(row);
        }
    });

    maintenanceTable.appendChild(thead);
    maintenanceTable.appendChild(tbody);
    maintenanceDevicesContainer.appendChild(maintenanceTable);
}



// EDIT PROFILE ----------------------------------------------------------------------------------//


editBtn.addEventListener('click', async () => {
    await setForm();
    toggleVisibility();
    editTab.style.display = 'block';
    updateBtn.addEventListener('click', async () => {
        await updateSiteInfo();
    });
});

async function setForm() {
    const val = await getSitesData();
    let currentSitename = document.getElementById('edit-name');
    currentSitename.value = val[site].name;
    let currentSiteLocation = document.getElementById('edit-location');
    currentSiteLocation.value = val[site].location;
}

async function updateSiteInfo() {
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


// UNASSIGNED DEVICES ----------------------------------------------------------------------------//


document.getElementById('user-search-input').addEventListener('input', filterUsers);
document.getElementById('cancel-search-btn').addEventListener('click', cancelSearch);
document.getElementById('assign-user-btn').addEventListener('click', assignUser);

unassignedDevicesLink.addEventListener('click', async () => {
    toggleVisibility();
    unassignedDevicesContainer.style.display = 'block';
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
let users = [];

async function showUserSearch(deviceId) {
    selectedDeviceId = deviceId;
    document.getElementById('user-search-container').style.display = 'block';
    const siteConsumerMapping = await getSiteConsumerMapping();
    users = siteConsumerMapping[site] || [];
    populateUserList(users);

    // Add event listener for clicking outside the search box
    document.addEventListener('click', handleClickOutside, true);
}

function populateUserList(userList) {
    const userListElem = document.getElementById('user-list');
    userListElem.innerHTML = '';
    userList.forEach(user => {
        const li = document.createElement('li');
        li.textContent = user;
        li.onclick = () => selectedUser(user);
        userListElem.appendChild(li);
    });
}

function selectedUser(user) {
    document.getElementById('user-search-input').value = user;
    document.getElementById('user-list').innerHTML = '';
}

function filterUsers() {
    const query = document.getElementById('user-search-input').value.toLowerCase(); // ADDED
    const filteredUsers = users.filter(user => user.toLowerCase().includes(query)); // ADDED
    populateUserList(filteredUsers); // ADDED
}

async function assignUser() {
    const selectedUser = document.getElementById('user-search-input').value;
    const consumerToDeviceMapping = await getConsumerDeviceMapping();
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
            const obj = {
                device: selectedDeviceId
            }
            await assignDeviceToUser(selectedUser, obj);
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


function handleClickOutside(event) {
    const userSearchContainer = document.getElementById('user-search-container');
    if (!userSearchContainer.contains(event.target)) {
        cancelSearch();
    }
}

function cancelSearch() {
    document.getElementById('user-search-container').style.display = 'none';
    document.removeEventListener('click', handleClickOutside, true);
}


// FIRMWARE ------------------------------------------------------------------------------------------------//


document.getElementById('firmware-link').addEventListener('click', async () => {
    toggleVisibility();
    firmwareVersionContainer.style.display = 'block';
    await fetchDeviceVersions();
    document.getElementById('upgrade-all-versions').addEventListener('click', async () => {
        await upgradeAllDeviceVersions();
    });
    document.getElementById('intimate-all').addEventListener('click', async () => {
        await intimateAll();
    });
});

async function fetchDeviceVersions() {
    try {
        // Fetch devices and their versions
        const devicesData = await getDevicesData();
        const versions = Object.keys(devicesData).map((deviceId) => {
            const device = devicesData[deviceId];
            return { id: deviceId, name: device.name, version: device.version };
        });

        // Display versions in a table
        displayDeviceVersions(versions);
    } catch (error) {
        console.error('Error fetching device versions:', error);
        alert('Error fetching device versions. Please try again.');
    }
}

async function upgradeAllDeviceVersions() {
    try {
        // Fetch devices and their versions
        const devicesData = await getDevicesData();
        const deviceIds = Object.keys(devicesData);
        const response = await fetch(`/publish-message/${site}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ deviceIds })
        });

        if (!response.ok) {
            throw new Error('Failed to upgrade device versions');
        }

        // Wait for 2 seconds before refreshing the device versions
        setTimeout(async () => {
            // Refresh the device versions after upgrade
            await fetchDeviceVersions();
            alert('All device versions upgraded successfully!');
        }, 2000);
    } catch (error) {
        console.error('Error upgrading device versions:', error);
        alert('Error upgrading device versions. Please try again.');
    }
}

function displayDeviceVersions(versions) {
    const tableContainer = document.getElementById('device-versions-container');
    tableContainer.innerHTML = ''; // Clear previous content

    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    // Create table headers
    const headers = ['Device ID', 'Device Name', 'Version'];
    const headerRow = document.createElement('tr');
    headers.forEach(headerText => {
        const header = document.createElement('th');
        header.textContent = headerText;
        headerRow.appendChild(header);
    });
    thead.appendChild(headerRow);

    // Populate table rows with device versions
    versions.forEach(device => {
        const row = document.createElement('tr');

        const deviceIdCell = document.createElement('td');
        deviceIdCell.textContent = device.id;
        row.appendChild(deviceIdCell);

        const deviceNameCell = document.createElement('td');
        deviceNameCell.textContent = device.name;
        row.appendChild(deviceNameCell);

        const versionCell = document.createElement('td');
        versionCell.textContent = device.version;
        row.appendChild(versionCell);

        tbody.appendChild(row);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    tableContainer.appendChild(table);
}


async function intimateAll() {
    try {
        const response = await fetch('/intimate-all', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: 'intimate' })
        });

        if (!response.ok) {
            throw new Error('Failed to intimate all devices');
        }

        alert('All devices intimated successfully!');
    } catch (error) {
        console.error('Error intimating all devices:', error);
        alert('Error intimating all devices. Please try again.');
    }
}