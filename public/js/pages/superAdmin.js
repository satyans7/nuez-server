import { getAllUsers, getAllApprovedRequests, getAllRejectedRequests, getAllPendingRequests, postRequesttoRoleChange, postapproveRoleChange, postrejectRoleChange } from '../client/client.js';

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
    let data = await getAllUsers();
    usersTableBody.innerHTML = '';
    if (data && data.length > 0) {
        data.forEach(user => {
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
                    _id: user._id,
                    reqRole: "consumer"
                }
                requestButton.addEventListener('click', () => requestRoleChange(user._id, request));
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
    let data = await getAllUsers();
    usersTableBody.innerHTML = '';
    if (data && data.length > 0) {
        data.forEach(user => {
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
                    _id: user._id,
                    reqRole: "consumer"
                }
                requestButton.addEventListener('click', () => requestRoleChange(user._id, request));
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



// On clicking Admin Tab

adminsTab.addEventListener('click', async () => {
    console.log("fetching all admins")
    hideAllLists();
    adminList.style.display = 'block';
    let data = await getAllUsers();
    adminsTableBody.innerHTML = '';
    if (data && data.length > 0) {
        data.forEach(user => {
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
                    _id: user._id,
                    reqRole: "consumer"
                }
                requestButton.addEventListener('click', () => requestRoleChange(user._id, request));
                actionCell.appendChild(requestButton);
                row.appendChild(nameCell);
                row.appendChild(emailCell);
                row.appendChild(actionCell);
                adminsTableBody.appendChild(row);
            }
        });
    } else {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="3">No Admin available</td>
        `;
        adminsTableBody.appendChild(row);
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
            const timeStampCell = document.createElement('td');
            timeStampCell.textContent = "00:00";
            row.appendChild(nameCell);
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
            const timeStampCell = document.createElement('td');
            timeStampCell.textContent = "00:00";
            row.appendChild(nameCell);
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
    pendingTableBody.innerHTML = '';
    if (data && data.length > 0) {
        data.forEach(user => {
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
                approveButton.addEventListener('click', () => approveRoleChange(user._id));
                const rejectButton = document.createElement('button');
                rejectButton.textContent = 'Deny';
                rejectButton.addEventListener('click', () => rejectRoleChange(user._id));
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
    console.log(id)
    const apr = {
        _id: id,
        action: "approved"
    }
    try {
        await postapproveRoleChange(id, apr);
        console.log('request sent')

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

    } catch (error) {
        console.log('Error in sending request')

    }
    pendingTabDisplay();
}




