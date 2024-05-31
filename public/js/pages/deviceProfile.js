import { getDevicesData } from "../client/client.js";
function editProfile() {
    // Functionality to edit the device profile
    console.log("Edit Profile clicked");
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
document.addEventListener('DOMContentLoaded', async() => {
    // Select the 'device-id' element
    const deviceIDElement = document.getElementById('device-id');
    // Set the text content to 'DEVICE ID: ' followed by the fetched device ID
    deviceIDElement.textContent = `DEVICE ID: ${getCurrentDevice()}`;

    //extra
    const currentId=getCurrentDevice();
    const devicesData = await getDevicesData();
   // console.log(devicesData);
    const particularDeviceData=devicesData[currentId];
    console.log(particularDeviceData);

    if(particularDeviceData){
        const deviceCard= document.getElementById('device-card');
        
        //clear existing card content
        //deviceCard.innerHTML ='';

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
     
        const deviceNameElement = document.createElement('h3');
        deviceNameElement.textContent = `Name: ${particularDeviceData.name}`;
        const deviceLocationElement = document.createElement('p');
        deviceLocationElement.textContent = `Location: ${particularDeviceData.location}`;
        const deviceConsumptionElement = document.createElement('p');
        deviceConsumptionElement.textContent = `Total Consumption: ${particularDeviceData.totalConsumption}`;
        const deviceStatusElement = document.createElement('p');
        deviceStatusElement.textContent = `Status: ${particularDeviceData.status}`;
        const deviceRegistrationDateElement = document.createElement('p');
        deviceRegistrationDateElement.textContent = `Registration Date: ${particularDeviceData.registrationDate}`;
        
        deviceCard.appendChild(deviceNameElement);
        deviceCard.appendChild(deviceLocationElement);
        deviceCard.appendChild(deviceConsumptionElement);
        deviceCard.appendChild(deviceStatusElement);
        deviceCard.appendChild(deviceRegistrationDateElement);
        deviceCard.appendChild(document.createElement('hr'));
        deviceCard.appendChild(buttonContainer);

    }else {
        // Handle case when no data is found for the deviceId
        console.error('Device data not found for ID:', currentId);
    }


});