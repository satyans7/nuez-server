
import {
    getDevicesData, getSiteDeviceMapping, getAllConsumers, getSiteConsumerMapping, getSitesData, updateSiteDataOnServer, deleteSiteToDeviceMapping, registerDevice, getConsumerDeviceMapping, assignDeviceToUser,
    deregisterConsumer,
    registerConsumer,
    enterMaintenance,
    exitMaintenance,
    getDeviceStatus,
    getAllDevicesUnderSite,
    getAllConsumersUnderSite,
    syncPiSourceCodeForParticularSite
} from '../client/client.js';


export function initializeSitePanel(sidebarid) {

    const alldevicesContainer = document.querySelector('#device-list');
    const allConsumerContainer = document.querySelector('#consumer-list');
    const devicesTableBody = document.getElementById('devices-table-body');
    const consumersTableBody = document.getElementById('consumers-table-body');//ID in PTS.js
    const deregisterConsumerTab = document.getElementById('deregister-container')
    const registerConsumerTab = document.getElementById('register-container')
    const registerBtn = document.getElementById('register-consumer-btn');
    const deregisterBtn = document.getElementById('deregister-consumer-btn');
    const btnGroup = document.getElementById('btn-grp')
    const headingText = document.getElementById('heading');
    const currentSite = document.getElementById('site-id');
    const updateBtn = document.getElementById('update-button');
    const registerConsumerForm = document.getElementById('register-consumer-form');
    const deregisterConsumerForm = document.getElementById('deregister-consumer-form');
    const unassignedDevicesContainer = document.getElementById('unassigned-devices-list');
    const piSourceCodeSyncBtn = document.getElementById('syncPiSourceCodeForSite')
    // Current Site Id
    const site = getCurrentSiteId();

    function getCurrentSiteId() {
        const fullUrl = window.location.href;
        const url = new URL(fullUrl);
        const pathname = url.pathname;
        const segments = pathname.split('/');
        return segments[segments.length - 1];
    }

    // Setting site Info

    async function setInfo() {
        const title = document.createElement('h1');
        const siteInfo = await getSitesData();
        title.textContent = `Welcome, ${siteInfo[site].name || site}`;
        headingText.appendChild(title);

        const currentid = document.createElement('h1');
        currentid.textContent = `Id : ${site}`;
        currentSite.appendChild(currentid);

    }


    //DISPLAY DEVICES
    async function displayAlldevices() {

        const data = await getAllDevicesUnderSite(site);
    
        const devices = Object.keys(data);
        if(devices && devices.length >0 ){
        devices.forEach(async key => {
            const device = data[key];
            if (device) {
                const row = document.createElement('tr');
                const nameCell = document.createElement('td');
                nameCell.textContent = key;
                const actionCell = document.createElement('td');
                actionCell.classList.add('action-cell');
                const requestButton = document.createElement('button');
                requestButton.textContent = '+';
                requestButton.addEventListener('click', () => {
                     // Check if a card already exists and toggle it
                     const existingCardRow = row.nextSibling;
                     if (existingCardRow && existingCardRow.classList.contains('card-row')) {
                         existingCardRow.remove();
                     } else {
                         const cardRow = document.createElement('tr');
                         cardRow.classList.add('card-row');
                         const cardCell = document.createElement('td');
                         cardCell.colSpan = 2; // Span across all columns


                         const deviceCard = document.createElement('div');
                         deviceCard.className = 'displaycard';
                         deviceCard.id = 'fetch-device-data';
                 
                         const cardHeading = document.createElement('div');
                         cardHeading.className = 'card-heading';
                 
                         const deviceName = document.createElement('h3');
                         deviceName.textContent = key;
                 
                         cardHeading.appendChild(deviceName);
                         deviceCard.appendChild(cardHeading);
                 
                         const cardBody = document.createElement('div');
                         cardBody.className = 'card-body';
                 
                         const deviceLocation = document.createElement('h4');
                         deviceLocation.textContent = device.location;
                 
                         cardBody.appendChild(deviceLocation);
                         deviceCard.appendChild(cardBody);

                         const card=deviceCard;

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
                devicesTableBody.appendChild(row);
            } 
        });
    }
    else{
        const row = document.createElement('tr');
            row.innerHTML = `<td colspan="2">No devices found for this site.</td>`;
            devicesTableBody.appendChild(row);
    }
    }


    // All Devices tab (Default) --------------------------------------------------------------------------//



    async function viewAlldevices() {
        alldevicesContainer.style.display = 'flex';
        const data = await getAllDevicesUnderSite(site);

        if (!data) {
            console.error(`No devices found for Site ID: ${site}`);
            alldevicesContainer.innerHTML = '<p>No devices found for this site.</p>';
            return;
        }

        const devices = Object.keys(data);
        alldevicesContainer.innerHTML = '';

        devices.forEach(key => {
            const device = data[key];
            if (device) {
                const deviceCard = createDeviceCard(device, key);
                alldevicesContainer.appendChild(deviceCard);
            } else {
                console.error(`Device not found for key: ${key}`);
            }
        });
    }


    function createDeviceCard(device, key) {
        const deviceCard = document.createElement('div');
        deviceCard.className = 'card';
        deviceCard.id = 'fetch-device-data';

        const cardHeading = document.createElement('div');
        cardHeading.className = 'card-heading';

        const deviceName = document.createElement('h3');
        deviceName.textContent = key;

        deviceCard.addEventListener('click', () => {
            const route = `/api/device-profile/${key}`;
            window.location.href = route;
        });

        cardHeading.appendChild(deviceName);
        deviceCard.appendChild(cardHeading);

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        const deviceLocation = document.createElement('h4');
        deviceLocation.textContent = device.location;

        cardBody.appendChild(deviceLocation);
        deviceCard.appendChild(cardBody);

        return deviceCard;
    }


//DISPLAY CONSUMERS

async function displayAllconsumers() {
    const data = await getAllConsumersUnderSite(site);

    const consumers = Object.keys(data);
    consumersTableBody.innerHTML = '';
    console.log(consumers);
    if(consumers && consumers.length>0 ){
    consumers.forEach(key => {
        const consumer = data[key];
        if (consumer) {
            const row = document.createElement('tr');
                const nameCell = document.createElement('td');
                nameCell.textContent = consumer.name;
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
                        consumerName.textContent = consumer.name;
                        cardHeading.appendChild(consumerName);
                        consumerCard.appendChild(cardHeading);

                        const cardBody = document.createElement('div');
                        cardBody.className = 'card-body';

                        const consumerLocation = document.createElement('h4');
                        consumerLocation.textContent = consumer.role;

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
                consumersTableBody.appendChild(row);
            
        } else {
            console.error(`Consumer not found for key: ${key}`);
        }
    });
}
else{
    const row = document.createElement('tr');
    row.innerHTML = `<td colspan="2">No consumer available for this site.</td>`;
    sitesTableBody.appendChild(row);
}
}
    // ALL CONSUMERS TAB ----------------------------------------------------------------------------//

    async function toggleConsumerTab() {
        console.log('toggle')
        await viewAllconsumers();       
        

        registerBtn.addEventListener('click', () => {
            registerConsumerTab.style.display = 'block';
            deregisterConsumerTab.style.display = 'none';
            allConsumerContainer.style.display = 'none';
            registerDomLoad();
            
        });
        deregisterBtn.addEventListener('click', () => {
            deregisterConsumerTab.style.display = 'block';
           registerConsumerTab.style.display = 'none';
           allConsumerContainer.style.display = 'none';
           deregisterDomLoad();           

        });

        document.getElementById('all-consumers-btn').addEventListener('click', ()=>{
            deregisterConsumerTab.style.display = 'none';
           registerConsumerTab.style.display = 'none';
           allConsumerContainer.style.display = 'block';
           viewAllconsumers();

        })
    }



    //consumer

    async function viewAllconsumers() {
        registerConsumerTab.style.display = "none";
        deregisterConsumerTab.style.display = 'none';
        allConsumerContainer.style.display = 'block';
        const data = await getAllConsumersUnderSite(site);

        if (!data) {
            console.error(`No consumers found for Site ID: ${site}`);
            allConsumerContainer.innerHTML = '<p>No consumers found for this site.</p>';
            return;
        }

        const consumers = Object.keys(data);
        allConsumerContainer.innerHTML = '';

        consumers.forEach(key => {
            const consumer = data[key];
            if (consumer) {
                const consumerCard = createConsumerCard(consumer, key);
                allConsumerContainer.appendChild(consumerCard);
            } else {
                console.error(`Consumer not found for key: ${key}`);
            }
        });
    }

    function createConsumerCard(consumer, key) {
        const consumerCard = document.createElement('div');
        consumerCard.className = 'card';
        consumerCard.id = 'fetch-consumer-data';

        const cardHeading = document.createElement('div');
        cardHeading.className = 'card-heading';

        const consumerName = document.createElement('h3');
        consumerName.textContent = consumer.name;

        consumerCard.addEventListener('click', () => {
            const adminId = getCurrentAdmin();
            const route = `/api/consumer-dashboard/${key}?adminId=${adminId}`;
            console.log(`Redirecting to: ${route}`);  // Log the route for debugging
            window.location.href = route;  // Ensure the redirection logic is executed
        });

        cardHeading.appendChild(consumerName);
        consumerCard.appendChild(cardHeading);

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        const consumerLocation = document.createElement('h4');
        consumerLocation.textContent = key;

        cardBody.appendChild(consumerLocation);
        consumerCard.appendChild(cardBody);

        return consumerCard;
    }

    function getCurrentAdmin() {
        const url = new URL(window.location.href);
        const searchParams = new URLSearchParams(url.search);
        return searchParams.get('adminId');
    }



    function populateSearchContainer(data, searchResultsContainer, siteIdInput) {
        data.forEach(val => {
            if (val.substring(0, 4) === 'user') {
                const row = document.createElement('div');
                row.className = 'search-result';
                row.textContent = val;
                row.addEventListener('click', () => {
                    siteIdInput.value = row.textContent;
                    const allResults = searchResultsContainer.getElementsByClassName("search-result");
                    for (let result of allResults) {
                        result.style.display = "none";
                    }
                });
                searchResultsContainer.appendChild(row);
            }
        });

        // Filter search results based on input value
        siteIdInput.addEventListener("input", function () {
            const filter = siteIdInput.value.toLowerCase();
            const searchResults = searchResultsContainer.getElementsByClassName("search-result");

            if (filter === "") {
                // Show all results if input is cleared
                for (let result of searchResults) {
                    result.style.display = "";
                }
            } else {
                // Filter results based on input
                for (let result of searchResults) {
                    const text = result.textContent.toLowerCase();
                    if (text.includes(filter)) {
                        result.style.display = "";
                    } else {
                        result.style.display = "none";
                    }
                }
            }
        });
    }

    async function registerDomLoad() {
        const searchResultsContainer = document.querySelector(".register-search-results");
        const siteIdInput = document.getElementById("register-consumer-id");
        const data = await getAllConsumers();
        const ids = Object.keys(data);
        searchResultsContainer.innerHTML = "";
        populateSearchContainer(ids, searchResultsContainer, siteIdInput);
        registerConsumerForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const consumerId = document.getElementById('register-consumer-id').value;
            const consumer = {
                consumer: consumerId
            };
            console.log(consumer)
            const jsonResponse = await registerConsumer(site, consumer);
            await viewAllconsumers();
            alert(jsonResponse.message);
            registerConsumerForm.reset();
        })
    }

    async function deregisterDomLoad() {
        const searchResultsContainer = document.querySelector(".deregister-search-results");
        const siteIdInput = document.getElementById("deregister-consumer-id");
        const data = await getSiteConsumerMapping();
        const ids = data[site];
        searchResultsContainer.innerHTML = "";
        populateSearchContainer(ids, searchResultsContainer, siteIdInput);

        deregisterConsumerForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const consumerId = document.getElementById('deregister-consumer-id').value;
            const consumer = {
                consumer: consumerId
            }
            try {
                const response = await deregisterConsumer(site, consumer);
                //await toggleConsumerTab();
                await viewAllconsumers();
                alert(response.message);
                deregisterConsumerForm.reset();

            } catch (error) {
                console.error('Error deregistering consumer:', error);
                alert(`${error.message}`);
            }
        })
    }


     // maintenance  



    async function maintenancefunc() {
        loadAllModesTable();
        document.getElementById('enter-maintenance').addEventListener('click', loadoperationalModetable);
        document.getElementById('exit-maintenance').addEventListener('click', loadmaintenanceModetable);
        document.getElementById('all-maintenance-devices').addEventListener('click', loadAllModesTable);
        
    }
    
    async function loadAllModesTable(){

        document.getElementById('maintenance-wrapper').style.display = 'none';
        document.getElementById('operational-wrapper').style.display = 'none';
        document.getElementById('all-modes-wrapper').style.display = 'flex';

        const allModesContainer = document.getElementById('all-modes-wrapper');
        const allModesTableBody = document.getElementById('all-mode-table-body');
        
        allModesContainer.style.display = 'flex';
        const deviceStatus = await getDeviceStatus({ "site_id": site })
     
        let ids = Object.keys(deviceStatus);
        allModesTableBody.innerHTML = '';
        ids.forEach(id => {
            const status = deviceStatus[id];
            const row = document.createElement('tr');
            const nameCell = document.createElement('td');
            nameCell.textContent = id;
            const statusCell = document.createElement('td');
            statusCell.textContent = status;
            if (status === 'MAINTENANCE') statusCell.style.color = 'red';
            else statusCell.style.color = 'green';
            row.appendChild(nameCell);
            row.appendChild(statusCell);
            allModesTableBody.appendChild(row);
        })

        
    }

    async function loadmaintenanceModetable(){

        document.getElementById('maintenance-wrapper').style.display = 'flex';
        document.getElementById('operational-wrapper').style.display = 'none';
        document.getElementById('all-modes-wrapper').style.display = 'none';

        const leftContainer = document.getElementById('left-container-maintenance');
        const rightContainer = document.getElementById('right-container-maintenance');
        const moveRightButton = document.getElementById('move-right-maintenance');
        const moveLeftButton = document.getElementById('move-left-maintenance');
        
            leftContainer.innerHTML = '';
        const deviceStatus = await getDeviceStatus({ "site_id": site });
        const items = Object.keys(deviceStatus);

        function createButtons(container, items) {
            items.forEach(item => {
                if(deviceStatus[item] === 'MAINTENANCE'){
                const button = document.createElement('button');
                button.textContent = item;
                button.classList.add('button-item');
                button.addEventListener('click', () => {
                    button.classList.toggle('selected');
                });
                container.appendChild(button);
            }
            });
        }

        createButtons(leftContainer, items);

        function moveItems(fromContainer, toContainer) {
            const selectedButtons = fromContainer.querySelectorAll('.selected');
            selectedButtons.forEach(button => {
                button.classList.remove('selected');
                toContainer.appendChild(button);
            });
        }

        moveRightButton.addEventListener('click', () => {
            moveItems(leftContainer, rightContainer);
        });

        moveLeftButton.addEventListener('click', () => {
            moveItems(rightContainer, leftContainer);
        });

        const sendBtn = document.getElementById('exit-maintenance-btn');
        sendBtn.addEventListener('click', changeToOperationalMode);

        async function changeToOperationalMode() {
            console.log('button is clicked')
            const selectedArray = Array.from(rightContainer.children).map(item => {
                return item.textContent.replace('Remove', '').trim();
            });

            console.log(selectedArray)

            const object = {
                "site_id": site,
                "devices_id": selectedArray
            }

            await exitMaintenance(object);
            rightContainer.innerHTML = '';
            await loadmaintenanceModetable();       
        
        }

    }

    async function loadoperationalModetable(){

        document.getElementById('maintenance-wrapper').style.display = 'none';
        document.getElementById('operational-wrapper').style.display = 'flex';
        document.getElementById('all-modes-wrapper').style.display = 'none';

        const leftContainer = document.getElementById('left-container-operational');
        const rightContainer = document.getElementById('right-container-operational');
        const moveRightButton = document.getElementById('move-right-operational');
        const moveLeftButton = document.getElementById('move-left-operational');
        
        leftContainer.innerHTML = '';
        const deviceStatus = await getDeviceStatus({ "site_id": site })
        const items = Object.keys(deviceStatus);

        function createButtons(container, items) {
            items.forEach(item => {
                if(deviceStatus[item] === 'OPERATIONAL'){
                const button = document.createElement('button');
                button.textContent = item;
                button.classList.add('button-item');
                button.addEventListener('click', () => {
                    button.classList.toggle('selected');
                });
                container.appendChild(button);
            }
            });
        }

        createButtons(leftContainer, items);

        function moveItems(fromContainer, toContainer) {
            const selectedButtons = fromContainer.querySelectorAll('.selected');
            selectedButtons.forEach(button => {
                button.classList.remove('selected');
                toContainer.appendChild(button);
            });
        }

        moveRightButton.addEventListener('click', () => {
            moveItems(leftContainer, rightContainer);
        });

        moveLeftButton.addEventListener('click', () => {
            moveItems(rightContainer, leftContainer);
        });

        const sendBtn = document.getElementById('enter-maintenance-btn');
        sendBtn.addEventListener('click', changeToMaintenaceMode)
    
        async function changeToMaintenaceMode() {
            console.log('button is clicked');
            const selectedArray = Array.from(rightContainer.children).map(item => item.textContent.trim());
    
            console.log(selectedArray);
    
            const object = {
                "site_id": site,
                "devices_id": selectedArray
            };
    
            await enterMaintenance(object);
            rightContainer.innerHTML = '';
            await loadoperationalModetable();
        }
    }
        

    // EDIT PROFILE ----------------------------------------------------------------------------------//


    async function editfunc() {
        await setForm();
        updateBtn.addEventListener('click', async () => {
            await updateSiteInfo();
        });
    };

    async function setForm() {
        const val = await getSitesData();
        let currentSitename = document.getElementById('edit-name');
        currentSitename.value = val[site].name;
        let currentSiteLocation = document.getElementById('edit-location');
        currentSiteLocation.value = val[site].location;
    }

    async function updateSiteInfo() {
        const newData = {
            name: document.getElementById('edit-name').value,
            location: document.getElementById('edit-location').value
        }
        try {
            const response = await updateSiteDataOnServer(newData, site);
            alert(response.message);
        } catch (error) {
            console.error('Error updating user:', error);
            alert('Error in Updating Info. Please try again.');
        }
        setForm();
    }


    // UNASSIGNED DEVICES ----------------------------------------------------------------------------//

    async function unassignedfunc() {
        const userSearchInput = document.getElementById('user-search-input');
        const cancelSearchBtn = document.getElementById('cancel-search-btn');
        const assignUserBtn = document.getElementById('assign-user-btn');
        
        if (userSearchInput) {
            userSearchInput.addEventListener('input', filterUsers);
        } else {
            console.error('Element with ID "user-search-input" not found.');
        }
    
        if (cancelSearchBtn) {
            cancelSearchBtn.addEventListener('click', cancelSearch);
        } else {
            console.error('Element with ID "cancel-search-btn" not found.');
        }
    
        if (assignUserBtn) {
            assignUserBtn.addEventListener('click', assignUser);
        } else {
            console.error('Element with ID "assign-user-btn" not found.');
        }
    
        await viewUnassignedDevices();
    }
    



    async function viewUnassignedDevices() {
        const siteToDeviceMapping = await getSiteDeviceMapping(); // Get device mapping for the current site
        const consumerToDeviceMapping = await getConsumerDeviceMapping(); // Get consumer device mapping for all users
        const siteConsumerMapping = await getSiteConsumerMapping(); // Get consumer mapping for the current site

        unassignedDevicesContainer.innerHTML = ''; // Clear previous content

        const devices = siteToDeviceMapping[site] || []; // Get devices for the current site

        // Create the table structure
        const table = document.createElement('table');
        table.id = 'unassigned-devices-table';
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');

        // Create the table header row
        const headerRow = document.createElement('tr');
        const deviceIdHeader = document.createElement('th');
        deviceIdHeader.textContent = 'Device ID';
        const actionHeader = document.createElement('th');
        actionHeader.textContent = 'Action';

        headerRow.appendChild(deviceIdHeader);
        headerRow.appendChild(actionHeader);
        thead.appendChild(headerRow);

        // Iterate through the devices and create table rows for unassigned devices
        devices.forEach((deviceId, index) => {
            if (!isDeviceAssigned(deviceId, consumerToDeviceMapping, siteConsumerMapping)) {
                const row = createUnassignedDeviceRow(deviceId, index);
                tbody.appendChild(row);
            }
        });

        table.appendChild(thead);
        table.appendChild(tbody);
        unassignedDevicesContainer.appendChild(table);
    }

    function isDeviceAssigned(deviceId, consumerToDeviceMapping, siteConsumerMapping, site) {
        const consumers = siteConsumerMapping[site] || []; // Get consumers of the current site

        // Iterate over the consumers and check if the device is assigned to any of them
        for (const consumerId of consumers) {
            if (consumerToDeviceMapping[consumerId]?.includes(deviceId)) {
                return true; // Device is assigned to a consumer of the current site
            }
        }

        // Check if the device is assigned to any users mapped to other sites
        for (const otherSite of Object.keys(siteConsumerMapping)) {
            if (otherSite !== site) {
                const otherSiteConsumers = siteConsumerMapping[otherSite] || [];
                for (const consumerId of otherSiteConsumers) {
                    if (consumerToDeviceMapping[consumerId]?.includes(deviceId)) {
                        return true; // Device is assigned to a consumer of another site
                    }
                }
            }
        }

        return false; // Device is not assigned to any consumer of the current site or other sites
    }


    function createUnassignedDeviceRow(deviceId, index) {
        const row = document.createElement('tr');
        row.id = `unassigned-device-row-${index}`;

        const deviceIdCell = document.createElement('td');
        deviceIdCell.id = `unassigned-device-id-${index}`;
        deviceIdCell.textContent = deviceId;
        row.appendChild(deviceIdCell);

        const actionCell = document.createElement('td');
        actionCell.id = `unassigned-device-action-${index}`;
        const assignButton = document.createElement('button');
        assignButton.id = `assign-button-${index}`; // Ensure this ID matches the CSS
        assignButton.textContent = 'Assign';
        assignButton.addEventListener('click', () => {
            // Implement assign functionality here
            showUserSearch(deviceId);
        });

        actionCell.appendChild(assignButton);
        row.appendChild(actionCell);

        return row;
    }


    //SEARCH 
    let selectedDeviceId;
    let users = [];

    async function showUserSearch(deviceId) {
        selectedDeviceId = deviceId;
        document.getElementById('user-search-container').style.display = 'block';
        const siteConsumerMapping = await getSiteConsumerMapping();
        users = siteConsumerMapping[site] || [];
        populateUserList(users);

        // Add event listener for clicking outside the search box
        document.addEventListener('click', handleClickOutside, true);
    }

    function populateUserList(userList) {
        const userListElem = document.getElementById('user-list');
        userListElem.innerHTML = '';
        userList.forEach(user => {
            const li = document.createElement('li');
            li.textContent = user;
            li.onclick = () => selectedUser(user);
            userListElem.appendChild(li);
        });
    }

    function selectedUser(user) {
        document.getElementById('user-search-input').value = user;
        document.getElementById('user-list').innerHTML = '';
    }

    function filterUsers() {
        const query = document.getElementById('user-search-input').value.toLowerCase(); // ADDED
        const filteredUsers = users.filter(user => user.toLowerCase().includes(query)); // ADDED
        populateUserList(filteredUsers); // ADDED
    }

    async function assignUser() {
        const selectedUser = document.getElementById('user-search-input').value;
        const consumerToDeviceMapping = await getConsumerDeviceMapping();
        const sitetoconsumer = await getSiteConsumerMapping();
        if (selectedUser && sitetoconsumer[site].includes(selectedUser)) {
            if (selectedDeviceId) {
                // Check if the user already exists in the mapping
                if (consumerToDeviceMapping[selectedUser]) {
                    // Check if the device is already assigned to the user
                    if (!consumerToDeviceMapping[selectedUser].includes(selectedDeviceId)) {
                        // Add the device to the existing user without modifying the existing mappings
                        consumerToDeviceMapping[selectedUser].push(selectedDeviceId);
                    } else {
                        alert(`Device ${selectedDeviceId} is already assigned to user ${selectedUser}.`);
                        return; // Exit the function if the device is already assigned to the user
                    }
                }

                alert(`Assigning user ${selectedUser} to device ${selectedDeviceId}`);

                // Make API call to update backend (if needed)
                const obj = {
                    device: selectedDeviceId
                }
                await assignDeviceToUser(selectedUser, obj);
                viewUnassignedDevices();
                document.getElementById('user-search-container').style.display = 'none';
                document.removeEventListener('click', handleClickOutside, true);
            } else {
                alert('Please select a device.');
            }
        } else {
            alert('Please enter a valid user id');
        }
    }


    function handleClickOutside(event) {
        const userSearchContainer = document.getElementById('user-search-container');
        if (!userSearchContainer.contains(event.target)) {
            cancelSearch();
        }
    }

    function cancelSearch() {
        document.getElementById('user-search-container').style.display = 'none';
        document.removeEventListener('click', handleClickOutside, true);
    }









    // FIRMWARE ------------------------------------------------------------------------------------------------//

    async function firmwarefunc() {
        await fetchDeviceVersions();
        await populateFirmwareDropdown();
        document.getElementById('upgrade-all-versions').addEventListener('click', async () => {
            await upgradeAllDeviceVersions();
        });
        document.getElementById('intimate-all').addEventListener('click', async () => {
            const dropdown = document.getElementById('firmware-dropdown');
            const selectedVersion = dropdown.options[dropdown.selectedIndex].textContent;
            await intimateAll(selectedVersion);
        });


        async function populateFirmwareDropdown() {
            try {
                console.log('Fetching firmware versions...');
                const response = await fetch('/api/firmware-versions');
                if (!response.ok) {
                    throw new Error('Failed to fetch firmware versions');
                }
        
                const firmwareVersions = await response.json();
                console.log('Firmware versions fetched:', firmwareVersions);
        
                const dropdown = document.getElementById('firmware-dropdown');
                if (!dropdown) {
                    throw new Error('Dropdown element not found');
                }
        
                dropdown.innerHTML = ''; // Clear previous options
                console.log('Populating dropdown...');
        
                firmwareVersions.forEach(version => {
                    const option = document.createElement('option');
                    option.value = version.id; // Assuming each version has a unique ID
                    option.textContent = version.name; // Display name of the version
                    dropdown.appendChild(option);
                });
        
                console.log('Dropdown populated successfully');
            } catch (error) {
                console.error('Error fetching firmware versions:', error);
            }
        }
        

        async function fetchDeviceVersions() {
            try {
                // Fetch devices and their versions
                const devicesData = await getDevicesData();
                const versions = Object.keys(devicesData).map((deviceId) => {
                    const device = devicesData[deviceId];
                    return { id: deviceId, name: device.name, version: device.version };
                });

                // Display versions in a table
                displayDeviceVersions(versions);
            } catch (error) {
                console.error('Error fetching device versions:', error);
                alert('Error fetching device versions. Please try again.');
            }
        }

        async function upgradeAllDeviceVersions() {
            try {
                // Fetch devices and their versions
                const devicesData = await getDevicesData();
                const deviceIds = Object.keys(devicesData);
                const response = await fetch(`/${site}/fetch-device-versions`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ deviceIds })
                });

                if (!response.ok) {
                    throw new Error('Fail to upgrade device versions');
                }

                // Wait for 2 seconds before refreshing the device versions
                setTimeout(() => {
                    // Refresh the device versions after upgrade
                    fetchDeviceVersions();
                    alert('All device versions upgraded successfully!');
                }, 7000);
            } catch (error) {
                console.error('Error upgrading device versions:', error);
                alert('Error upgrading device versions. Please try again.');
            }
        }

        function displayDeviceVersions(versions) {
            const tableContainer = document.getElementById('device-versions-container');
            tableContainer.innerHTML = ''; // Clear previous content

            const table = document.createElement('table');
            table.id = 'firmware-table';
            const thead = document.createElement('thead');
            const tbody = document.createElement('tbody');

            // Create table headers
            const headers = ['Device ID', 'Version'];
            const headerRow = document.createElement('tr');
            headers.forEach(headerText => {
                const header = document.createElement('th');
                header.textContent = headerText;
                headerRow.appendChild(header);
            });
            thead.appendChild(headerRow);

            // Populate table rows with device versions
            versions.forEach(device => {
                const row = document.createElement('tr');

                const deviceIdCell = document.createElement('td');
                deviceIdCell.textContent = device.id;
                row.appendChild(deviceIdCell);


                const versionCell = document.createElement('td');
                versionCell.textContent = device.version;
                row.appendChild(versionCell);

                tbody.appendChild(row);
            });

            table.appendChild(thead);
            table.appendChild(tbody);
            tableContainer.appendChild(table);
        }

        async function intimateAll(version) {
            try {
                const message = { version: version };
                const response = await fetch(`/${site}/intimate-all-devices`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(message)
                });

                if (!response.ok) {
                    throw new Error('Failed to intimate all devices');
                }

                alert('All devices intimated successfully!');
            } catch (error) {
                console.error('Error intimating all devices:', error);
                alert('Error intimating all devices. Please try again.');
            }
        }
    };
    async function administrationTabDisplay(){
        piSourceCodeSyncBtn.addEventListener('click', async () => {
            const userConfirmed = confirm('Are you sure you want to sync the firmware data for this site?');
            if (userConfirmed) {
                await syncPiSourceCodeForParticularSite(site);
            }
            alert("THIS SITE HAS BEEN UPDATED")
        })
    }
    async function eventListeners() {
        if(sidebarid=== 'viewdevices') displayAlldevices();
        else if (sidebarid === 'viewconsumers') displayAllconsumers();
        else if (sidebarid === 'device') viewAlldevices();
        else if (sidebarid === 'consumer') toggleConsumerTab();
        else if (sidebarid === 'devicemaintenance') maintenancefunc();
        else if (sidebarid === 'editprofile') editfunc();
        else if (sidebarid === 'unassigneddeviceslink') unassignedfunc();
        else if (sidebarid === 'firmwarelink') firmwarefunc();
        else if (sidebarid === 'administration') administrationTabDisplay();
    }

    //DOMLOADED
    async function call() {
        if (sidebarid === 'device') {
            setInfo();
            viewAlldevices();
        }
    }
    call();
    eventListeners();

}




