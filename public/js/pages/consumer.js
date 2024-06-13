import { getDevicesData, getConsumerDeviceMapping, getAllAdmins,registerConsumerDeviceMapping,deregisterConsumerDeviceMapping ,postDeviceData} from '../client/client.js';
document.addEventListener('DOMContentLoaded', async () => {
    document.getElementById('logout-link').addEventListener("click",(event)=>{
        window.location.href="/logout"
    })
});
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
    registerButton.textContent = 'Register Device for Consumer';
    registerButton.id = 'register-consumer-device';
    registerButton.addEventListener('click', () => {
        // Registration logic
        document.getElementById('register-form-container').style.display = 'block';
        document.getElementById('deregister-form-container').style.display = 'none';
    });

    const deregisterButton = document.createElement('button');
    deregisterButton.textContent = 'Deregister Device for Consumer';
    deregisterButton.id = 'deregister-consumer-device';
    deregisterButton.addEventListener('click', () => {
        // Deregistration logic
        document.getElementById('deregister-form-container').style.display = 'block';
        document.getElementById('register-form-container').style.display = 'none';

    });

    buttonContainer.appendChild(registerButton);
    buttonContainer.appendChild(deregisterButton);
    
  //handle form submission for registration
    document.getElementById('register-consumer-device-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const consumer = getCurrentId();
        const deviceId = document.getElementById('register-device-id').value;
        const deviceName = document.getElementById('device-name').value;
        const deviceLocation = document.getElementById('device-location').value;
        const deviceTotalConsumption = document.getElementById('device-total-consumption').value;
        const deviceStatus = document.getElementById('device-status').value;
    
        const ob = {
            device: deviceId
        };
    
        try {
            const res = await registerConsumerDeviceMapping(ob, consumer);
            alert(res.message);
            document.getElementById('register-consumer-device-form').reset();
            document.getElementById('register-form-container').style.display = 'none';
    
            // Create a device profile with user inputs
            await createDeviceProfile(deviceId, deviceName, deviceLocation, deviceTotalConsumption, deviceStatus);
    
            // Refresh the devices view
            await viewAlldevices();
        } catch (error) {
            console.error('Error registering device:', error);
            alert(`Error: ${error.message}`);
        }
    });
    
    // Function to create a device profile with user inputs and registration date
    async function createDeviceProfile(deviceId, name, location, totalConsumption, status) {
        const deviceProfile = {
            id: deviceId,
            name: name,
            location: location,
            totalConsumption: totalConsumption,
            status: status,
            registrationDate: new Date().toISOString() // Adding registration date
        };
    
        try {
            // Post the device data to the server
            await postDeviceData(deviceId, deviceProfile);
            console.log(`Device profile for ${deviceId} created successfully.`);
        } catch (error) {
            console.error('Error creating device profile:', error);
        }
    }
}

    // Handle form submission for deregistration
    document.getElementById('deregister-consumer-device-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const deviceId = document.getElementById('deregister-device-id').value;
        const consumer = getCurrentId();
        const object = {
            device: deviceId
        };

        try {
            const response = await deregisterConsumerDeviceMapping(consumer, object);
            alert(response.message);
            document.getElementById('deregister-consumer-device-form').reset();
            document.getElementById('deregister-consumer-device-form').style.display = 'none';
            await viewAlldevices();  // Refresh the devices view
        } catch (error) {
            console.error('Error deregistering device:', error);
            alert(`Error: ${error.message}`);
        }
    });

    // Handle cancel buttons
    document.getElementById('cancel-register-button').addEventListener('click', () => {
        document.getElementById('register-form-container').style.display = 'none';
    });

    document.getElementById('cancel-deregister-button').addEventListener('click', () => {
        document.getElementById('deregister-form-container').style.display = 'none';
    });


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

// registerBtn.addEventListener('click', () => {
//     allSitesContainer.style.display = 'none';
//     deregisterTab.style.display = 'none';
//     registerTab.style.display = 'block';

//     const form = document.getElementById('register-site-form');
//     form.addEventListener('submit', async(event) =>{
//         event.preventDefault();
//         const user = getCurrentAdmin();
//         const ob = {
//             site : document.getElementById('site-id').value
//         }

//         const res = await registerSite(ob, user);
//         alert(res.message);
//         form.reset();        
//     })
// })

// deregisterBtn.addEventListener('click', () => {
//     allSitesContainer.style.display = 'none';
//     registerTab.style.display = 'none';
//     deregisterTab.style.display = 'block';
   
//     document.getElementById('deregister-site-form').addEventListener('submit', async (event) => {
//         event.preventDefault();
      
//         const siteId = document.getElementById('deregister-site-id').value;
//         const user= getCurrentAdmin();
//         console.log(siteId);
//         const object={
//             site: siteId
//         }
    
//         try {
//           const response = await deregisterSite(user,object);
//           viewAllSites();
//         alert(response.message);
//         deregisterform.reset();
        
//         } catch (error) {
//           console.error('Error deregistering site:', error);
//           alert(`${error.message}`);
//         }
//       });

// })
async function handleDeviceDeregistration() {
    const consumerId = getCurrentId();
    const deviceId = document.getElementById('deregister-device-id').value;
    const deviceData = { device: deviceId };

    try {
        const response = await deregisterDevice(consumerId, deviceData);
        alert(response.message);
        document.getElementById('deregister-site-form').reset();
        toggleFormVisibility('deregister-form-container', false);
        await viewAllDevices();
    } catch (error) {
        console.error('Error deregistering device:', error);
        alert(`Error: ${error.message}`);
    }
}

async function handleDeviceRegistration() {
    const consumerId = getCurrentId();
    const deviceId = document.getElementById('register-device-id').value;
    const deviceData = { device: deviceId };

    try {
        const response = await registerDevice(consumerId, deviceData);
        alert(response.message);
        document.getElementById('register-site-form').reset();
        toggleFormVisibility('register-form-container', false);
        await viewAllDevices();
    } catch (error) {
        console.error('Error registering device:', error);
        alert(`Error: ${error.message}`);
    }
}