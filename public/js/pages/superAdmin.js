import {
    getAllConsumers,
    getAllAdmins,
    getAllApprovedRequests,
    getAllRejectedRequests,
    getAllPendingRequests,
    postRequesttoRoleChange,
    postapproveRoleChange,
    postrejectRoleChange,
    getUserSiteMapping,
    getConsumerDeviceMapping
} from '../client/client.js';

const usersTab = document.getElementById('users-tab');
const adminsTab = document.getElementById('admins-tab');
const approvedTab = document.getElementById('approved-tab');
const rejectedTab = document.getElementById('rejected-tab');
const pendingTab = document.getElementById('pending-tab');
const usersList = document.getElementById('user-list');
const adminList = document.getElementById('admin-list');
const approvedList = document.getElementById('approved-list');
const rejectedList = document.getElementById('rejected-list');
const pendingList = document.getElementById('pending-list');
const allLists = document.getElementsByClassName('list');
const usersTableBody = document.getElementById('users-table-body')
const adminsTableBody = document.getElementById('admins-table-body')
const pendingTableBody = document.getElementById('pending-table-body')
const approvedTableBody = document.getElementById('approved-table-body')
const rejectedTableBody = document.getElementById('rejected-table-body')


// Function to disable the 'Request for Role change' button
function disableRequestButton(button, msg) {
    button.disabled = true;
    button.style.cursor = 'not-allowed'
    button.style.background = 'gray'
    button.textContent = msg; // Optionally change button text
}

// Function to enable the 'Request for Role change' button
function enableRequestButton(button, msg) {
    button.disabled = false;
    button.textContent = msg; // Optionally reset button text
}

// Function to update the 'Request for Role change' button state
async function updateRequestButtonState(requestButton, id) {
    const admintosite = await getUserSiteMapping();
    const consumertodevice= await getConsumerDeviceMapping();
    console.log(admintosite)
    console.log(consumertodevice)
    const pendingRequests = await getAllPendingRequests();
    if (pendingRequests[id] && pendingRequests[id].requestStatus === 'pending') {
        const msg = 'Request Sent';
        disableRequestButton(requestButton, msg);
    } else if ((admintosite[id] && admintosite[id].length > 0)  || (consumertodevice[id] && consumertodevice[id].length > 0) ) {
        const msg = 'Already have sites'
        disableRequestButton(requestButton, msg);

    } else {
        const msg = 'Request for Role Change';
        enableRequestButton(requestButton, msg);
    }
}

// Function to handle 'Request for Role change' button click
async function handleRequestRoleChange(id, requestButton, request) {
    try {
        disableRequestButton(requestButton); // Disable button on click
        await requestRoleChange(id, request);
        alert("Request added successfully");
    } catch (error) {
        console.log('Error in sending request');
        enableRequestButton(requestButton); // Re-enable button in case of error
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    hideAllLists();
    usersList.style.display = 'block';
    await loadUsersTable();
});

async function loadUsersTable() {
    console.log("fetching users");
    let data = await getAllConsumers();
    usersTableBody.innerHTML = '';
    let ids = Object.keys(data);
    if (ids && ids.length > 0) {
        ids.forEach(async id => {
            let user = data[id];
            if (user.role === "consumer") {
                const row = document.createElement('tr');
                const nameCell = document.createElement('td');
                nameCell.textContent = user.name;
                const emailCell = document.createElement('td');
                emailCell.textContent = user.email;
                const actionCell = document.createElement('td');
                const requestButton = document.createElement('button');
                requestButton.textContent = 'Request for Role change';
                const goToButton = document.createElement('button');
                goToButton.textContent = 'Go to';
                const request = {
                    _id: id,
                    reqRole: "admin"
                }
                await updateRequestButtonState(requestButton, id);
                requestButton.addEventListener('click', async () => {
                    if (requestButton.disabled === false) { // Check if request can be sent
                        await handleRequestRoleChange(id, requestButton, request);
                    }
                });
                goToButton.addEventListener('click', () => {
                    const adminId = 'superadmin';
                    window.location.href = `/api/consumer-dashboard/${id}?adminId=${adminId}`;
                });
                
                actionCell.appendChild(requestButton);
                actionCell.appendChild(goToButton);
                row.appendChild(nameCell);
                row.appendChild(emailCell);
                row.appendChild(actionCell);
                usersTableBody.appendChild(row);
            }
        });
    } else {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="3">No users available</td>`;
        usersTableBody.appendChild(row);
    }
}

// Function to hide all tables
function hideAllLists() {
    for (let i = 0; i < allLists.length; i++) {
        allLists[i].style.display = 'none';
    }
}

// On clicking Users Tab
usersTab.addEventListener('click', async () => {
    hideAllLists();
    usersList.style.display = 'block';
    await loadUsersTable();
});

adminsTab.addEventListener('click', async () => {
    hideAllLists();
    adminList.style.display = 'block';
    await loadAdminsTable();
});

async function loadAdminsTable() {
    console.log("fetching admins");
    let data = await getAllAdmins();
    adminsTableBody.innerHTML = '';
    let ids = Object.keys(data);
    if (ids && ids.length > 0) {
        ids.forEach(async id => {
            let user = data[id];
            if (user.role === "admin") {
                const row = document.createElement('tr');
                const nameCell = document.createElement('td');
                nameCell.textContent = user.name;
                const emailCell = document.createElement('td');
                emailCell.textContent = user.email;
                const actionCell = document.createElement('td');
                const requestButton = document.createElement('button');
                requestButton.textContent = 'Request for Role change';
                const goToButton = document.createElement('button');
                goToButton.textContent = 'Go to';
                const request = {
                    _id: id,
                    reqRole: "consumer"
                }
                await updateRequestButtonState(requestButton, id);
                requestButton.addEventListener('click', async () => {
                    if (requestButton.disabled === false) { // Check if request can be sent
                        await handleRequestRoleChange(id, requestButton, request);
                    }
                });
                goToButton.addEventListener('click', () => {
                    window.location.href = `/api/admin-dashboard/${id}`;
                });
                actionCell.appendChild(requestButton);
                actionCell.appendChild(goToButton);
                row.appendChild(nameCell);
                row.appendChild(emailCell);
                row.appendChild(actionCell);
                adminsTableBody.appendChild(row);
            }
        });
    } else {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="3">No admins available</td>`;
        adminsTableBody.appendChild(row);
    }
}

async function requestRoleChange(id, req) {
    try {
        await postRequesttoRoleChange(id, req);
        console.log('request sent');
    } catch (error) {
        console.log('Error in sending request');
    }
}

// Approved Tab
approvedTab.addEventListener('click', async () => {
    hideAllLists();
    approvedList.style.display = 'block';
    await loadApprovedTable();
});

async function loadApprovedTable() {
    console.log("fetching approved requests");
    let data = await getAllApprovedRequests();
    approvedTableBody.innerHTML = '';
    if (data && data.length > 0) {
        data.forEach(user => {
            const row = document.createElement('tr');
            const nameCell = document.createElement('td');
            nameCell.textContent = user.name;
            const reqRoleCell = document.createElement('td');
            reqRoleCell.textContent = user.roleRequested;
            const timeStampCell = document.createElement('td');
            timeStampCell.textContent = user.timeStamp;
            row.appendChild(nameCell);
            row.appendChild(reqRoleCell);
            row.appendChild(timeStampCell);
            approvedTableBody.appendChild(row);
        });
    } else {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="2">No approved requests available</td>`;
        approvedTableBody.appendChild(row);
    }
}

// Rejected Tab
rejectedTab.addEventListener('click', async () => {
    hideAllLists();
    rejectedList.style.display = 'block';
    await loadRejectedTable();
});

async function loadRejectedTable() {
    console.log("fetching rejected requests");
    let data = await getAllRejectedRequests();
    rejectedTableBody.innerHTML = '';
    if (data && data.length > 0) {
        data.forEach(user => {
            const row = document.createElement('tr');
            const nameCell = document.createElement('td');
            nameCell.textContent = user.name;
            const reqRoleCell = document.createElement('td');
            reqRoleCell.textContent = user.roleRequested;
            const timeStampCell = document.createElement('td');
            timeStampCell.textContent = user.timeStamp;
            row.appendChild(nameCell);
            row.appendChild(reqRoleCell);
            row.appendChild(timeStampCell);
            rejectedTableBody.appendChild(row);
        });
    } else {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="2">No rejected requests available</td>`;
        rejectedTableBody.appendChild(row);
    }
}

async function pendingTabDisplay() {
    console.log("fetching all pending requests");
    hideAllLists();
    pendingList.style.display = 'block';
    let data = await getAllPendingRequests();
    let ids = Object.keys(data);
    pendingTableBody.innerHTML = '';
    if (ids && ids.length > 0) {
        ids.forEach(id => {
            let user = data[id];
            if (user.requestStatus === "pending") {
                const row = document.createElement('tr');
                const nameCell = document.createElement('td');
                nameCell.textContent = user.name;
                const currentRoleCell = document.createElement('td');
                currentRoleCell.textContent = user.currentRole;
                const requestedRoleCell = document.createElement('td');
                requestedRoleCell.textContent = user.requestedRole;
                const actionCell = document.createElement('td');
                const approveButton = document.createElement('button');
                approveButton.textContent = 'Approve';
                approveButton.addEventListener('click', () => approveRoleChange(id));
                const rejectButton = document.createElement('button');
                rejectButton.textContent = 'Deny';
                rejectButton.addEventListener('click', () => rejectRoleChange(id));
                actionCell.appendChild(approveButton);
                actionCell.appendChild(rejectButton);
                row.appendChild(nameCell);
                row.appendChild(currentRoleCell);
                row.appendChild(requestedRoleCell);
                row.appendChild(actionCell);
                pendingTableBody.appendChild(row);
            }
        });
    } else {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="4">No Pending Requests available</td>`;
        pendingTableBody.appendChild(row);
    }
}

pendingTab.addEventListener('click', () => pendingTabDisplay());

async function approveRoleChange(id) {
    console.log(id);
    const apr = {
        _id: id,
        action: "approved"
    }
    try {
        await postapproveRoleChange(id, apr);
        console.log('request sent');
    } catch (error) {
        console.log('Error in sending request');
    }
    pendingTabDisplay();
}

async function rejectRoleChange(id) {
    console.log(id);
    const rej = {
        _id: id,
        action: "denied"
    }
    try {
        await postrejectRoleChange(id, rej);
        console.log('request sent');
    } catch (error) {
        console.log('Error in sending request');
    }
    pendingTabDisplay();
}
