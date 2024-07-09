import { getDevicesData, updateDeviceData } from "../client/client.js";
var DEVICE_ID;
var SITE_ID;
// Function to handle profile editing
function editProfile() {
    console.log("Edit Profile clicked");

    const form = document.getElementById('editProfileForm');
    form.style.display = 'block'; // Display the overlay
    form.classList.add('overlay-content');

    const deviceId = getCurrentDevice();
    populateFormWithDeviceData(deviceId);
}

// Function to populate the form with device data
function populateFormWithDeviceData(deviceId) {
    const deviceName = document.getElementById('device-name').innerText.split(': ')[1];
    const deviceLocation = document.getElementById('device-location').innerText.split(': ')[1];
    const deviceTotalConsumption = document.getElementById('device-totalConsumption').innerText.split(': ')[1];
    const deviceStatus = document.getElementById('device-status').innerText.split(': ')[1];
    const deviceRegistrationDate = document.getElementById('device-registrationDate').innerText.split(': ')[1];



    document.getElementById('deviceId').value = deviceId;
    document.getElementById('deviceName').value = deviceName;
    document.getElementById('deviceLocation').value = deviceLocation;
    document.getElementById('deviceTotalConsumption').value = deviceTotalConsumption;
    document.getElementById('deviceStatus').value = deviceStatus;
    document.getElementById('deviceRegistrationDate').value = deviceRegistrationDate;

}

// Function to delete a device
function deleteDevice() {
    console.log("Delete Device clicked");
    // Add your delete logic here
}

// Function to get the current device ID from the URL
function getCurrentDevice() {
    const url = new URL(window.location.href);
    const segments = url.pathname.split('/');
    return segments[segments.length - 1];
}

// Function to initialize the device profile page
async function initializeProfilePage() {
    document.getElementById('device-id').textContent = `DEVICE ID: ${getCurrentDevice()}`;
    const currentId = getCurrentDevice();
    const devicesData = await getDevicesData();
    const particularDeviceData = devicesData[currentId];
    console.log(currentId)

    if (particularDeviceData) {
        DEVICE_ID = currentId;
        console.log(particularDeviceData);
        SITE_ID = particularDeviceData.siteId;
        grafanaPanel();
        populateDeviceCard(particularDeviceData);
        addEditDeleteButtons();
    } else {
        console.error('Device data not found for ID:', currentId);
    }


    setupFormSubmission();
}

// Function to populate the device card with data
function populateDeviceCard(data) {
    console.log(data.owner);
    document.getElementById('device-name').textContent = `Name: ${data.name}`;
    document.getElementById('device-location').textContent = `Location: ${data.location}`;
    //document.getElementById('device-totalConsumption').textContent = `Total Consumption: ${data.totalConsumption}`;
    //document.getElementById('device-status').textContent = `Status: ${data.status}`;
    document.getElementById('device-owner').textContent = `Owner: ${data.owner}`;
    //document.getElementById('device-registrationDate').textContent = `Registration Date: ${data.registrationDate}`;
}

// Function to add Edit and Delete buttons to the device card
function addEditDeleteButtons() {
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit Profile';
    editButton.onclick = editProfile;

    // const deleteButton = document.createElement('button');
    // deleteButton.textContent = 'Delete Device';
    // deleteButton.onclick = deleteDevice;

    // buttonContainer.appendChild(editButton);
    // buttonContainer.appendChild(deleteButton);

    // document.getElementById('device-card').appendChild(buttonContainer);
}

// Function to setup form submission
function setupFormSubmission() {
    const form = document.getElementById('editProfileForm');
    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent default form submission
        saveProfile();
    });

    document.getElementById('cancelButton').addEventListener('click', closeForm);
}

// Function to handle form submission and save profile
async function saveProfile() {
    const deviceId = document.getElementById('deviceId').value;
    const deviceName = document.getElementById('deviceName').value;
    const deviceLocation = document.getElementById('deviceLocation').value;
    const deviceTotalConsumption = document.getElementById('deviceTotalConsumption').value;
    const deviceStatus = document.getElementById('deviceStatus').value;
    const deviceRegistrationDate = document.getElementById('deviceRegistrationDate').value;
    const confirmCheckbox = document.getElementById('confirmCheckbox');

    if (confirmCheckbox.checked) {
        const updatedData = {
            name: deviceName,
            location: deviceLocation,
            totalConsumption: deviceTotalConsumption,
            status: deviceStatus,
            registrationDate: deviceRegistrationDate
        };

        console.log('Updating device profile with data:', updatedData);
        await updateDeviceData(deviceId, updatedData);

        closeForm();
        window.location.reload(); // Reload the page to show updated data
    } else {
        console.log('Please confirm that you want to update the details.');
    }
}

// Function to close the form
function closeForm() {
    document.getElementById('editProfileForm').style.display = 'none'; // Hide the form when cancel is clicked
}

// Initialize the profile page once the DOM is loaded
document.addEventListener('DOMContentLoaded', initializeProfilePage);

async function createIframeTextPanel(url) {
    let newDiv = document.createElement('div');

    // Set the class name for the new div
    newDiv.className = 'grafana-text-panel';
    // Create the iframe element

    const iframe1 = document.createElement('iframe');

    iframe1.src = url;
    iframe1.width = "300";
    iframe1.height = "150";
    iframe1.frameBorder = "0";
    newDiv.appendChild(iframe1);
    // Append the iframe to the div with id 'graph-card'
    document.getElementById('graph-card').appendChild(newDiv);
}
async function createIframeGraphPanel(url) {
    let newDiv = document.createElement('div');

    // Set the class name for the new div
    newDiv.className = 'grafana-graph-panel';
    // Create the iframe element

    const iframe1 = document.createElement('iframe');

    iframe1.src = url;
    iframe1.width = "500";
    iframe1.height = "300";
    iframe1.frameBorder = "0";
    newDiv.appendChild(iframe1);
    // Append the iframe to the div with id 'graph-card'
    document.getElementById('graph-card').appendChild(newDiv);
}
async function grafanaPanel() {

    const panel_1_URL = `http://206.189.138.34:3000/d-solo/io7xPk_Iz/water-consumption-dashboard?orgId=1&var-device_id=${DEVICE_ID}&var-site_id=${SITE_ID}&from=1720483941783&to=1720505541783&refresh=1m&panelId=8`

    const panel_2_URL=`http://206.189.138.34:3000/d-solo/io7xPk_Iz/water-consumption-dashboard?orgId=1&var-device_id=${DEVICE_ID}&var-site_id=${SITE_ID}&refresh=30s&panelId=2`
    createIframeTextPanel(panel_1_URL);
    createIframeGraphPanel(panel_2_URL)
    
};

