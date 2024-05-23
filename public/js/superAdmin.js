//import * as client from "./client";
import { getAllUsers, getAllApprovedRequests, getAllRejectedRequests, getAllPendingRequests } from './client.js';

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

function hideAllLists() {
    for (let i = 0; i < allLists.length; i++) {
        allLists[i].style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    hideAllLists();
    usersList.style.display = 'block';
    //client.getAllUsers();
    let data = await getAllUsers();
    //console.log(data);
    usersTableBody.innerHTML = '';
    if (data && data.Users && data.Users.length > 0) {
        data.Users.forEach(user => {
            if (user.role === "consumer") {
                const row = document.createElement('tr');
                row.innerHTML = `
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>
                    <button onclick="promoteUser('${user.id}')">Promote</button>
                </td>
            `;
                usersTableBody.appendChild(row);
            }
        });
    }
    
});


usersTab.addEventListener('click', async () => {
    hideAllLists();
    usersList.style.display = 'block';
    //client.getAllUsers();
    let data = await getAllUsers();
    //console.log(data);
    usersTableBody.innerHTML = '';
    if (data && data.Users && data.Users.length > 0) {
        data.Users.forEach(user => {
            if(user.role === "consumer"){
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>
                    <button onclick="promoteUser('${user.id}')">Promote</button>
                </td>
            `;
            usersTableBody.appendChild(row);
            }
        });
    }
});

adminsTab.addEventListener('click', async () => {
    hideAllLists();
    adminList.style.display = 'block';
    //client.getAllUsers();
    let data = await getAllUsers();
    //console.log(data);
    adminsTableBody.innerHTML = '';
    if (data && data.Users && data.Users.length > 0) {
        data.Users.forEach(user => {
            if (user.role === "admin") {
                const row = document.createElement('tr');
                row.innerHTML = `
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>
                    <button onclick="promoteUser('${user.id}')">Demote</button>
                </td>
            `;
                adminsTableBody.appendChild(row);
            }
        });
    }
});

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

pendingTab.addEventListener('click', () => {
    hideAllLists();
    pendingList.style.display = 'block';
    //client.getAllPendingRequests();
    getAllPendingRequests();
});
