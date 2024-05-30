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
document.addEventListener('DOMContentLoaded', () => {
    // Select the 'device-id' element
    const deviceIDElement = document.getElementById('device-id');
    // Set the text content to 'DEVICE ID: ' followed by the fetched device ID
    deviceIDElement.textContent = `DEVICE ID: ${getCurrentDevice()}`;
});