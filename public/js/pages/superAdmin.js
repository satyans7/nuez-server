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
    getConsumerDeviceMapping,
    getSitesData,
    syncFirmwareData,
    syncSourceCode,
    sendFirmwareToSites
} from '../client/client.js';



export function initializeSuperAdminPanel(sidebarid) {
    const usersTableBody = document.getElementById('users-table-body')
    const adminsTableBody = document.getElementById('admins-table-body')
    const sitesTableBody = document.getElementById('sites-table-body');
    const pendingTableBody = document.getElementById('pending-table-body')
    const approvedTableBody = document.getElementById('approved-table-body')
    const rejectedTableBody = document.getElementById('rejected-table-body')
    const administrationList = document.getElementById('administration-list')
    const firmwareSyncBtn = document.getElementById('syncFirmware')
    const sourceCodeSyncBtn = document.getElementById('syncSourceCode')
    const firmwareToSitesBtn = document.getElementById('firmwareToSitesBtn')
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
        const consumertodevice = await getConsumerDeviceMapping();
        console.log(admintosite)
        console.log(consumertodevice)
        const pendingRequests = await getAllPendingRequests();
        if (pendingRequests[id] && pendingRequests[id].requestStatus === 'pending') {
            const msg = 'Request Sent';
            disableRequestButton(requestButton, msg);
        } else if(admintosite[id] && admintosite[id].length > 0) {
            const msg = 'Already have sites'
            disableRequestButton(requestButton, msg);

        }else if(consumertodevice[id] && consumertodevice[id].length > 0){
            const msg = 'Already have devices'
            disableRequestButton(requestButton, msg);

        } else {
            const msg = 'Request for Role Change';
            enableRequestButton(requestButton, msg);
        }
    }

    // Function to handle 'Request for Role change' button click
    async function handleRequestRoleChange(id, requestButton, request) {
        try {
            disableRequestButton(requestButton, 'Request sent'); // Disable button on click
            await requestRoleChange(id, request);
            alert("Request added successfully");
        } catch (error) {
            console.log('Error in sending request');
            enableRequestButton(requestButton); // Re-enable button in case of error
        }
    }


    async function displayUsersTable() {
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
                    const actionCell = document.createElement('td');
                    actionCell.classList.add('action-cell');
                    const requestButton = document.createElement('button');
                    requestButton.textContent = '+';
                   
                    
                    requestButton.addEventListener('click', () => {

                        const existingCardRow = row.nextSibling;
                        if (existingCardRow && existingCardRow.classList.contains('card-row')) {
                            existingCardRow.remove();
                        } else {
                            const cardRow = document.createElement('tr');
                            cardRow.classList.add('card-row');
                            const cardCell = document.createElement('td');
                            cardCell.colSpan = 2; // Span across all columns
                            
    
                            const consumerCard = document.createElement('div');
                            consumerCard.className = 'displaycard';
                            consumerCard.id = 'fetch-consumer-data';
    
                            const cardHeading = document.createElement('div');
                            cardHeading.className = 'card-heading';
    
                            const consumerName = document.createElement('h3');
                            consumerName.textContent = user.name;
                            cardHeading.appendChild(consumerName);
                            consumerCard.appendChild(cardHeading);
    
                            const cardBody = document.createElement('div');
                            cardBody.className = 'card-body';
    
                            const consumerLocation = document.createElement('h4');
                            consumerLocation.textContent = user.email;;
    
                            cardBody.appendChild(consumerLocation);
                            consumerCard.appendChild(cardBody);
    
    
    
                            const card = consumerCard;
                            cardCell.appendChild(card);
                            cardRow.appendChild(cardCell);
    
                            // Insert the card row after the current row
                            row.parentNode.insertBefore(cardRow, row.nextSibling);
                        }
                        
                        });
                    
                    
                    row.style.cursor = "pointer";
                    actionCell.appendChild(requestButton);
                    row.appendChild(nameCell); 
                    row.appendChild(actionCell);            
                    usersTableBody.appendChild(row);
                }
            });
        } else {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="2">No users available</td>`;
            usersTableBody.appendChild(row);
        }
    }


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
                    const idCell = document.createElement('td');
                    idCell.textContent = id;
                    const actionCell = document.createElement('td');
                    const requestButton = document.createElement('button');
                    requestButton.textContent = 'Request for Role change';
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
                    nameCell.addEventListener('click', () => {
                        const adminId = 'superadmin';
                        window.location.href = `/api/consumer-dashboard/${id}?adminId=${adminId}`;
                    });
                    nameCell.style.cursor = "pointer";

                    actionCell.appendChild(requestButton);
                    row.appendChild(nameCell);
                    row.appendChild(idCell);
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

async function displayAdminsTable(){
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
                    const actionCell = document.createElement('td');
                    actionCell.classList.add('action-cell');
                    const requestButton = document.createElement('button');
                    requestButton.textContent = '+';
        
                    requestButton.addEventListener('click', () => {

                        const existingCardRow = row.nextSibling;
                        if (existingCardRow && existingCardRow.classList.contains('card-row')) {
                            existingCardRow.remove();
                        } else {
                            const cardRow = document.createElement('tr');
                            cardRow.classList.add('card-row');
                            const cardCell = document.createElement('td');
                            cardCell.colSpan = 2; // Span across all columns
                            
    
                            const adminCard = document.createElement('div');
                            adminCard.className = 'displaycard';
                            adminCard.id = 'fetch-admin-data';
    
                            const cardHeading = document.createElement('div');
                            cardHeading.className = 'card-heading';
    
                            const adminName = document.createElement('h3');
                            adminName.textContent = user.name;
                            cardHeading.appendChild(adminName);
                            adminCard.appendChild(cardHeading);
    
                            const cardBody = document.createElement('div');
                            cardBody.className = 'card-body';
    
                            const adminLocation = document.createElement('h4');
                            adminLocation.textContent = user.email;
    
                            cardBody.appendChild(adminLocation);
                            adminCard.appendChild(cardBody);
    
    
    
                            const card = adminCard;
                            cardCell.appendChild(card);
                            cardRow.appendChild(cardCell);
    
                            // Insert the card row after the current row
                            row.parentNode.insertBefore(cardRow, row.nextSibling);
                        }
                        
                       
                    });
                    row.style.cursor = "pointer";
                    actionCell.appendChild(requestButton);
                    row.appendChild(nameCell);
                    row.appendChild(actionCell);
                    adminsTableBody.appendChild(row);
                }
            });
        } else {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="2">No admins available</td>`;
            adminsTableBody.appendChild(row);
        }

}
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
                    const idCell = document.createElement('td');
                    idCell.textContent = id;
                    const actionCell = document.createElement('td');
                    const requestButton = document.createElement('button');
                    requestButton.textContent = 'Request for Role change';
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
                    nameCell.addEventListener('click', () => {
                        window.location.href = `/api/admin-dashboard/${id}`;
                    });
                    nameCell.style.cursor = "pointer"
                    actionCell.appendChild(requestButton);
                    row.appendChild(nameCell);
                    row.appendChild(idCell);
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

    async function displaySitesTable(){

        let data = await getSitesData();
        console.log(data)
        sitesTableBody.innerHTML = '';
        let ids = Object.keys(data);
        if (ids && ids.length > 0) {
            ids.forEach(async id => {
                let site = data[id];
                const row = document.createElement('tr');
                const nameCell = document.createElement('td');
                nameCell.textContent = site.name;
                const actionCell = document.createElement('td');
                actionCell.classList.add('action-cell');
                    const requestButton = document.createElement('button');
                    requestButton.textContent = '+';

                    requestButton.addEventListener('click', () => {
                        const existingCardRow = row.nextSibling;
                        if (existingCardRow && existingCardRow.classList.contains('card-row')) {
                            existingCardRow.remove();
                        } else {
                            const cardRow = document.createElement('tr');
                            cardRow.classList.add('card-row');
                            const cardCell = document.createElement('td');
                            cardCell.colSpan = 2; // Span across all columns
                            
    
                            const siteCard = document.createElement('div');
                            siteCard.className = 'displaycard';
                            siteCard.id = 'fetch-site-data';
    
                            const cardHeading = document.createElement('div');
                            cardHeading.className = 'card-heading';
    
                            const siteName = document.createElement('h3');
                            siteName.textContent = site.name;
                            cardHeading.appendChild(siteName);
                            siteCard.appendChild(cardHeading);
    
                            const cardBody = document.createElement('div');
                            cardBody.className = 'card-body';
    
                            const siteLocation = document.createElement('h4');
                            siteLocation.textContent = site.location;
    
                            cardBody.appendChild(siteLocation);
                            siteCard.appendChild(cardBody);
    
    
    
                            const card = siteCard;
                            cardCell.appendChild(card);
                            cardRow.appendChild(cardCell);
    
                            // Insert the card row after the current row
                            row.parentNode.insertBefore(cardRow, row.nextSibling);
                        }
                        
                    });

                row.style.cursor = "pointer";
                actionCell.appendChild(requestButton);
                row.appendChild(nameCell);
                row.appendChild(actionCell); 
                sitesTableBody.appendChild(row);

            });
            


        } else {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="2">No sites available</td>`;
            sitesTableBody.appendChild(row);
        }

 }

    async function loadSitesTable() {
        let data = await getSitesData();
        console.log(data)
        sitesTableBody.innerHTML = '';
        let ids = Object.keys(data);
        if (ids && ids.length > 0) {
            ids.forEach(async id => {
                let site = data[id];
                const row = document.createElement('tr');
                const nameCell = document.createElement('td');
                nameCell.textContent = site.name;
                const locationCell = document.createElement('td');
                locationCell.textContent = site.location;
                nameCell.addEventListener('click', () => {
                    window.location.href = `/api/site-dashboard/${id}`;
                });
                nameCell.style.cursor = "pointer";
                row.appendChild(nameCell);
                row.appendChild(locationCell);
                sitesTableBody.appendChild(row);

            });
            firmwareToSitesBtn.addEventListener("click", async () => {
                await sendFirmwareToSites();
                alert("btn clicked")
            })


        } else {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="2">No sites available</td>`;
            sitesTableBody.appendChild(row);
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



    async function loadApprovedTable() {
        console.log("fetching approved requests");
        let data = await getAllApprovedRequests();
        let ids = Object.keys(data);
        approvedTableBody.innerHTML = '';
        if (ids && ids.length > 0) {
            ids.forEach(id => {
                const user = data[id];
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

 

    async function loadRejectedTable() {
        console.log("fetching rejected requests");
        let data = await getAllRejectedRequests();
        let ids = Object.keys(data);
        rejectedTableBody.innerHTML = '';
        if (ids && ids.length > 0) {
            ids.forEach(id => {
                const user = data[id];
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
                    const roleChangeCell = document.createElement('td');
                    roleChangeCell.textContent = `${user.currentRole} to ${user.requestedRole}`;
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
                    row.appendChild(roleChangeCell );
                    row.appendChild(actionCell);
                    pendingTableBody.appendChild(row);
                }
            });
        } else {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="3">No Pending Requests available</td>`;
            pendingTableBody.appendChild(row);
        }
    }


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

    


    // Add this to your existing JavaScript

    // document.getElementById('intimate-all-btn').addEventListener('click', async () => {
    //     try {
    //         const response = await fetch('/intimate-all-sites', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify({ message: 'intimate' })
    //         });

    //         if (!response.ok) {
    //             throw new Error('Failed to intimate all sites');
    //         }

    //         alert('All sites intimated successfully!');
    //     } catch (error) {
    //         console.error('Error intimating all sites:', error);
    //         alert('Error intimating all sites. Please try again.');
    //     }
    // });
    async function eventListeners(){
        if(sidebarid==='viewconsumers') displayUsersTable();
        else if(sidebarid==='viewadmins') displayAdminsTable();
        else if(sidebarid==='viewsites') displaySitesTable();
        else if(sidebarid==='users')loadUsersTable();
        else if(sidebarid==='admins')loadAdminsTable();
        else if(sidebarid==='sites')loadSitesTable();
        else if(sidebarid==='approved')loadApprovedTable();
        else if(sidebarid==='rejected')loadRejectedTable();
        else if(sidebarid==='pending')pendingTabDisplay();
        else if(sidebarid==='administration'){
            administrationTab.addEventListener('click', async () => {
                hideAllLists();
                administrationList.style.display = 'block';
                firmwareSyncBtn.addEventListener('click', async () => {
                    const userConfirmed = confirm('Are you sure you want to sync the firmware data?');
                    if (userConfirmed) {
                        await syncFirmwareData();
                    }
                    alert("Firmware update complete. Please visit the relevant site-page to apply the updated firmware.");
        
                });
                sourceCodeSyncBtn.addEventListener('click', async () => {
                    const userConfirmed = confirm('Are you sure you want to sync the firmware data?');
                    if (userConfirmed) {
                        await syncSourceCode();
                    }
                    alert("SERVER HAS BEEN UPDATED")
                })
            });
        }
    }
    eventListeners();
    
}