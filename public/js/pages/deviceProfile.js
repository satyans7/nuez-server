import { getDevicesData, updateDeviceData } from "../client/client.js";

function editProfile() {
    // Functionality to edit the device profile
    console.log("Edit Profile clicked");

    const form = document.getElementById('editProfileForm');
    form.style.display = 'block';
    const deviceId = getCurrentDevice();
    const deviceName = document.getElementById('device-name').innerText.split(': ')[1];
    const deviceLocation = document.getElementById('device-location').innerText.split(': ')[1];
    const deviceTotalConsumption = document.getElementById('device-totalConsumption').innerText.split(': ')[1];
    const deviceStatus = document.getElementById('device-status').innerText.split(': ')[1];
    const deviceRegistrationDate = document.getElementById('device-registrationDate').innerText.split(': ')[1];

    // Populate the form
    document.getElementById('deviceId').value = deviceId;
    document.getElementById('deviceName').value = deviceName;
    document.getElementById('deviceLocation').value = deviceLocation;
    document.getElementById('deviceTotalConsumption').value = deviceTotalConsumption;
    document.getElementById('deviceStatus').value = deviceStatus;
    document.getElementById('deviceRegistrationDate').value = deviceRegistrationDate;
}

function deleteDevice() {
    // Functionality to delete the device
    console.log("Delete Device clicked");
}

function getCurrentDevice() {
    const fullUrl = window.location.href;
    const url = new URL(fullUrl);
    const pathname = url.pathname;
    const segments = pathname.split('/');
    const deviceId = segments[segments.length - 1];
    return deviceId;
}

document.addEventListener('DOMContentLoaded', async () => {
    // Select the 'device-id' element
    const deviceIDElement = document.getElementById('device-id');
    // Set the text content to 'DEVICE ID: ' followed by the fetched device ID
    deviceIDElement.textContent = `DEVICE ID: ${getCurrentDevice()}`;

    const currentId = getCurrentDevice();
    const devicesData = await getDevicesData();
    const particularDeviceData = devicesData[currentId];
    console.log(particularDeviceData);

    if (particularDeviceData) {
        const deviceCard = document.getElementById('device-card');

        // Create button container
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit Profile';
        editButton.onclick = editProfile;
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete Device';
        deleteButton.onclick = deleteDevice;

        // Append buttons to the container
        buttonContainer.appendChild(editButton);
        buttonContainer.appendChild(deleteButton);

        const deviceNameElement = document.getElementById('device-name');
        deviceNameElement.textContent = `Name: ${particularDeviceData.name}`;
        const deviceLocationElement = document.getElementById('device-location');
        deviceLocationElement.textContent = `Location: ${particularDeviceData.location}`;
        const deviceConsumptionElement = document.getElementById('device-totalConsumption');
        deviceConsumptionElement.textContent = `Total Consumption: ${particularDeviceData.totalConsumption}`;
        const deviceStatusElement = document.getElementById('device-status');
        deviceStatusElement.textContent = `Status: ${particularDeviceData.status}`;
        const deviceRegistrationDateElement = document.getElementById('device-registrationDate');
        deviceRegistrationDateElement.textContent = `Registration Date: ${particularDeviceData.registrationDate}`;

        deviceCard.appendChild(buttonContainer);
    } else {
        // Handle case when no data is found for the deviceId
        console.error('Device data not found for ID:', currentId);
    }

    // Handle form submission
    const form = document.getElementById('editProfileForm');
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission
        saveProfile();
    });
});

function saveProfile() {
    // Get the form data
    const deviceId = document.getElementById('deviceId').value;
    const deviceName = document.getElementById('deviceName').value;
    const deviceLocation = document.getElementById('deviceLocation').value;
    const deviceTotalConsumption = document.getElementById('deviceTotalConsumption').value;
    const deviceStatus = document.getElementById('deviceStatus').value;
    const deviceRegistrationDate = document.getElementById('deviceRegistrationDate').value;
    const confirmCheckbox = document.getElementById('confirmCheckbox');

    // Check if the user has confirmed the update
    if (confirmCheckbox.checked) {
        // Prepare the data to send to the server
        const updatedData = {
            name: deviceName,
            location: deviceLocation,
            totalConsumption: deviceTotalConsumption,
            status: deviceStatus,
            registrationDate: deviceRegistrationDate
        };

        // Log the data being sent
        console.log('Updating device profile with data:', updatedData);

        // Call the controller function to update the device profile
        updateDeviceData(deviceId, updatedData);
    } else {
        console.log('Please confirm that you want to update the details.');
    }
}
