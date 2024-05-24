import { getAllUsers, getAllApprovedRequests, getAllRejectedRequests, getAllPendingRequests } from '../client/client.js';

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
                row.innerHTML = `
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>
                    <button onclick="requestRoleChange('${user._id}')">Request for Role change</button>
                </td>
            `;
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
                row.innerHTML = `
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>
                    <button onclick="requestRoleChange('${user._id}')">Request for Role change</button>
                </td>
            `;
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
                row.innerHTML = `
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>
                    <button onclick="requestRoleChange('${user._id}')">Request for Role change</button>
                </td>
            `;
                adminsTableBody.appendChild(row);
            }
        });
    } else {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="3">No Admin available</td>
        `;
        usersTableBody.appendChild(row);
    }
});

function requestRoleChange(id) {
    console.log('role change requested')

}


pendingTab.addEventListener('click', async() => {
    console.log("fetching all pending requests")
    hideAllLists();
    pendingList.style.display = 'block';
    let data = await getAllPendingRequests();
    pendingTableBody.innerHTML = '';
    if (data && data.length > 0) {
        data.forEach(user => {
            if (user.requestStatus === "pending") {
                const row = document.createElement('tr');
                row.innerHTML = `
                <td>${user.name}</td>
                <td>${user.currentRole}</td>
                <td>${user.requestedRole}</td>
                <td>
                    <button onclick="approveRoleChange('${user._id}')">Approve</button>
                    <button onclick="rejectRoleChange('${user._id}')">Reject</button>
                </td>
            `;
                pendingTableBody.appendChild(row);
            }
        });
    } else {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="2">No Pending Requests available</td>
        `;
        pendingTableBody.appendChild(row);
    }
});



async function approveRoleChange(id){
    console.log('Role change request Accepted !')
    alert('Request Accepted')

}

async function rejectRoleChange(id){
    console.log('Role change request Denied!')
    alert('Request Denied')

}


approvedTab.addEventListener('click', () => {
    hideAllLists();
    approvedList.style.display = 'block';
    //client.getAllApprovedRequests();
    getAllApprovedRequests();
});

rejectedTab.addEventListener('click', () => {
    hideAllLists();
    rejectedList.style.display = 'block';
    //client.getAllRejectedRequests();
    getAllRejectedRequests();
});

