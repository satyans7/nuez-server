import { getAllConsumers,getAllAdmins, getAllApprovedRequests, getAllRejectedRequests, getAllPendingRequests, postRequesttoRoleChange, postapproveRoleChange, postrejectRoleChange } from '../client/client.js';

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
const userRequestState = {};


// Function to disable the 'Request for Role change' button and update state
function disableRequestButton(button, id) {
    button.disabled = true;
    button.textContent = 'Request Sent'; // Optionally change button text
    userRequestState[id] = true; // Update state to indicate request sent
}

// Function to enable the 'Request for Role change' button and update state
function enableRequestButton(button, id) {
    button.disabled = false;
    button.textContent = 'Request for Role change'; // Optionally reset button text
    userRequestState[id] = false; // Update state to indicate request can be sent
}

// Function to enable or disable the 'Request for Role change' button based on the user request state
function updateRequestButtonState(requestButton, id) {
    if (userRequestState[id]) {
        requestButton.disabled = true;
        requestButton.textContent = 'Request Sent'; // Optionally change button text
    } else {
        requestButton.disabled = false;
        requestButton.textContent = 'Request for Role change'; // Optionally reset button text
    }
}

// Function to handle 'Request for Role change' button click
async function handleRequestRoleChange(id, requestButton, request) {
    try {
        disableRequestButton(requestButton, id); // Disable button on click
        await requestRoleChange(id, request);
        alert("Request added successfully");
    } catch (error) {
        console.log('Error in sending request');
        enableRequestButton(requestButton, id); // Re-enable button in case of error
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    // Fetch pending request data
    const pendingRequests = await getAllPendingRequests();

    // Iterate through pending request data
    for (const userId in pendingRequests) {
        const user = pendingRequests[userId];
        // Check if the user has a pending request
        if (user.requestStatus === 'pending') {
            // Disable the button for this user
            const requestButton = document.getElementById(`request-button-${userId}`);
            if (requestButton) {
                requestButton.disabled = true;
                requestButton.textContent = 'Request Sent';
            }
        }
    }
});


//function to hide all tables

function hideAllLists() {
    for (let i = 0; i < allLists.length; i++) {
        allLists[i].style.display = 'none';
    }
}

// Default table on loading

document.addEventListener('DOMContentLoaded', async () => {
    console.log("fetching users")
    hideAllLists();
    usersList.style.display = 'block';
    let data = await getAllConsumers();
    usersTableBody.innerHTML = '';
    let ids=Object.keys(data);
    if (ids && ids.length > 0) {
        ids.forEach(id => {
            let user=data[id];
            if (user.role === "consumer") {
          
                const row = document.createElement('tr');
                const nameCell = document.createElement('td');
                nameCell.textContent = user.name;
                const emailCell = document.createElement('td');
                emailCell.textContent = user.email;
                const actionCell = document.createElement('td');
                const requestButton = document.createElement('button');
                requestButton.textContent = 'Request for Role change';
                const request = {
                    _id: id,
                    reqRole: "admin"
                }
                 // Update button state based on user request state
                 updateRequestButtonState(requestButton, id);

                 requestButton.addEventListener('click', async (event) => {
                     if (!userRequestState[id]) { // Check if request has not been sent
                         await handleRequestRoleChange(id, requestButton, request);
                     }
                 });
                
                actionCell.appendChild(requestButton);
                row.appendChild(nameCell);
                row.appendChild(emailCell);
                row.appendChild(actionCell);
                usersTableBody.appendChild(row);
            }
        });
    } else {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="3">No users available</td>
        `;
        usersTableBody.appendChild(row);
    }

});



// On clicking Users Tab

usersTab.addEventListener('click', async () => {
    console.log("fetching users")
    hideAllLists();
    usersList.style.display = 'block';
    let data = await getAllConsumers();
    let ids=Object.keys(data);
    let datap = await getAllPendingRequests();
    let req_id=Object.keys(datap);
    usersTableBody.innerHTML = '';
    if (ids && ids.length > 0) {
        ids.forEach(id => {
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

                const request = {
                    _id: id,
                    reqRole: "admin"
                }
                 // Update button state based on user request state
                 updateRequestButtonState(requestButton, id);

                 requestButton.addEventListener('click', async (event) => {
                     if (!userRequestState[id]) { // Check if request has not been sent
                         await handleRequestRoleChange(id, requestButton, request);
                     }
                 });

                actionCell.appendChild(requestButton);
                row.appendChild(nameCell);
                row.appendChild(emailCell);
                row.appendChild(actionCell);
                usersTableBody.appendChild(row);
            }
        });
    } else {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="3">No users available</td>
        `;
        usersTableBody.appendChild(row);
    }
});

adminsTab.addEventListener('click', async () => {
    console.log("fetching admin")
    hideAllLists();
    usersList.style.display = 'block';
    let data = await getAllAdmins();
    let ids=Object.keys(data);
    let datap = await getAllPendingRequests();
    let req_id=Object.keys(datap);
    usersTableBody.innerHTML = '';
    if (ids && ids.length > 0) {
        ids.forEach(id => {
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
                const request = {
                    _id: id,
                    reqRole: "consumer"
                }
                 // Update button state based on user request state
                updateRequestButtonState(requestButton, id);

                requestButton.addEventListener('click', async (event) => {
                    if (!userRequestState[id]) { // Check if request has not been sent
                        await handleRequestRoleChange(id, requestButton, request);
                    }
                });
                actionCell.appendChild(requestButton);
                row.appendChild(nameCell);
                row.appendChild(emailCell);
                row.appendChild(actionCell);
                usersTableBody.appendChild(row);
            }
        });
    } else {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="3">No users available</td>
        `;
        usersTableBody.appendChild(row);
    }
});



async function requestRoleChange(id, req) {
    console.log(id)
    try {
        await postRequesttoRoleChange(id, req);
        console.log('request sent')

    } catch (error) {
        console.log('Error in sending request')

    }
}


// Approved Tab


approvedTab.addEventListener('click', async () => {
    hideAllLists();
    approvedList.style.display = 'block';
    let data = await getAllApprovedRequests();
    console.log(data)
    approvedTableBody.innerHTML = '';
    if (data && data.length > 0) {
        data.forEach(user => {

            const row = document.createElement('tr');
            const nameCell = document.createElement('td');
            nameCell.textContent = user.name;
            const reqRoleCell = document.createElement('td');
            reqRoleCell.textContent = user.roleRequested;
            const timeStampCell = document.createElement('td');
            timeStampCell.textContent =user.timeStamp;
            row.appendChild(nameCell);
            row.appendChild(reqRoleCell);
            row.appendChild(timeStampCell);
            approvedTableBody.appendChild(row);
        });
    } else {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="2">No users available</td>
        `;
        approvedTableBody.appendChild(row);
    }
});


// Rejected Tab


rejectedTab.addEventListener('click', async () => {
    hideAllLists();
    rejectedList.style.display = 'block';
    let data = await getAllRejectedRequests();
    console.log(data)
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
        row.innerHTML = `
            <td colspan="2">No users available</td>
        `;
        rejectedTableBody.appendChild(row);
    }
});




async function pendingTabDisplay() {
    console.log("fetching all pending requests")
    hideAllLists();
    pendingList.style.display = 'block';
    let data = await getAllPendingRequests();
    let ids=Object.keys(data);
    pendingTableBody.innerHTML = '';
    if (ids && ids.length > 0) {
        ids.forEach(id => {
            let user=data[id];
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
        row.innerHTML = `
            <td colspan="4">No Pending Requests available</td>
        `;
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
        console.log('request sent')
        userRequestState[id] = false; // Update user request state to false after approval
    } catch (error) {
        console.log('Error in sending request')
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
        console.log('request sent')
        userRequestState[id] = false; // Update user request state to false after rejection
    } catch (error) {
        console.log('Error in sending request')
    }
    pendingTabDisplay();
}
