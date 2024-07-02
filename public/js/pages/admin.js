import { getSitesData, getUserSiteMapping, registerDevice, registerSite, deregisterSite, getAllSitesUnderAdmin } from '../client/client.js';


export function initializeAdminPanel(sidebarid) {
    const sitesTableBody = document.getElementById('sites-table-body');
    const allSitesContainer = document.getElementById('all-site-cards');
    const registerTab = document.getElementById('register-form-container');
    const deregisterTab = document.getElementById('deregister-form-container');
    const deregisterform = document.getElementById('deregister-site-form');

    //REGISTER SITE

    function populateSearchContainer(data, searchResultsContainer, siteIdInput) {
        data.forEach(val => {
            if (val.substring(0, 4) === 'site') {
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


    async function registerDomLoad()  {
        const searchResultsContainer = document.querySelector(".register-search-results");
        const siteIdInput = document.getElementById("site-id");
        const data = await getSitesData();
        const ids = Object.keys(data);
        populateSearchContainer(ids, searchResultsContainer, siteIdInput);
    };

    async function registerbtn(){
        registerTab.style.display = 'block';
        const form = document.getElementById('register-site-form');
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const user = getCurrentAdmin();
            const ob = {
                site: document.getElementById('site-id').value
            }

            const res = await registerSite(ob, user);
            await viewAllSites();
            alert(res.message);
            form.reset();
        });

        document.getElementById('register-cancel-button').addEventListener('click', async () => {
          
            allSitesContainer.style.display = 'block';
            registerTab.style.display = 'none';
            await viewAllSites();
        });
    };



    //DEREGISTER SITE

    async function deregisterDomLoad (){
        const searchResultsContainer = document.querySelector(".deregister-search-results");
        const siteIdInput = document.getElementById("deregister-site-id");
        const user = getCurrentAdmin();
        const sites = await getUserSiteMapping();
        const ids = sites[user];
        populateSearchContainer(ids, searchResultsContainer, siteIdInput);
    };

    async function deregisterbtn(){
        
        deregisterTab.style.display = 'block';

        document.getElementById('deregister-site-form').addEventListener('submit', async (event) => {
            event.preventDefault();

            const siteId = document.getElementById('deregister-site-id').value;
            const user = getCurrentAdmin();
            console.log(siteId);
            const object = {
                site: siteId
            }

            try {
                const response = await deregisterSite(user, object);
                await viewAllSites();
                alert(response.message);
                deregisterform.reset();

            } catch (error) {
                console.error('Error deregistering site:', error);
                alert(`${error.message}`);
            }
        });

        //when cancel button is clicked
        document.getElementById('deregister-cancel-button').addEventListener('click', async () => {
            
            allSitesContainer.style.display = 'block';
            deregisterTab.style.display = 'none';
            await viewAllSites();
        });

    };

    

    function getCurrentAdmin() {
        const fullUrl = window.location.href;
        const url = new URL(fullUrl);
        const pathname = url.pathname;
        const segments = pathname.split('/');
        const userId = segments[segments.length - 1];
        return userId;
    };


    async function displayAllSites() {
        const AdminId = getCurrentAdmin();
        console.log(AdminId);
        const val = await getAllSitesUnderAdmin(AdminId);
        const sites = Object.keys(val);
        sitesTableBody.innerHTML= '';
        console.log(sites);
        if(sites && sites.length>0){
        sites.forEach(async key => {
            let site = val[key];
            if (site) {
                const row = document.createElement('tr');
                const nameCell = document.createElement('td');
                nameCell.textContent = site.name;
                const locationCell = document.createElement('td');
                locationCell.textContent = site.location;
                const actionCell = document.createElement('td');
                const requestButton = document.createElement('button');
                requestButton.textContent = '+';
                requestButton.addEventListener('click', () => {
                    const nextRow = row.nextSibling;
                    if (nextRow && nextRow.classList.contains('expanded')) {
                        nextRow.remove();  // Hide the expanded row
                    } else {
                        const expandedRow = document.createElement('tr');
                        expandedRow.classList.add('expanded');
                        const expandedCell = document.createElement('td');
                        expandedCell.colSpan = 3;
    
                        const innerTable = document.createElement('table');
                        const headerRow = document.createElement('tr');
                        const passwordHeader = document.createElement('th');
                        passwordHeader.textContent = 'Password';
                        const workHeader = document.createElement('th');
                        workHeader.textContent = 'Work';
    
                        headerRow.appendChild(passwordHeader);
                        headerRow.appendChild(workHeader);
                        innerTable.appendChild(headerRow);
    
                        const dataRow = document.createElement('tr');
                        const passwordCell = document.createElement('td');
                        passwordCell.textContent = '123';
                        const workCell = document.createElement('td');
                        workCell.textContent = 'job';
    
                        dataRow.appendChild(passwordCell);
                        dataRow.appendChild(workCell);
                        innerTable.appendChild(dataRow);
    
                        expandedCell.appendChild(innerTable);
                        expandedRow.appendChild(expandedCell);
                        row.parentNode.insertBefore(expandedRow, nextRow);
                    }
                });
                row.style.cursor = "pointer";
                actionCell.appendChild(requestButton);
                row.appendChild(nameCell);
                row.appendChild(locationCell);    
                row.appendChild(actionCell);            
                sitesTableBody.appendChild(row);
            }
        });
    } else{
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="3">No users available</td>`;
        sitesTableBody.appendChild(row);
    
    }
 }

    async function viewAllSites() {
        allSitesContainer.style.display = 'flex';
        const AdminId = getCurrentAdmin();
        console.log(AdminId)
        const val = await getAllSitesUnderAdmin(AdminId)
        const sites = Object.keys(val);
        allSitesContainer.innerHTML = '';
        console.log(sites)
        sites.forEach(key => {
            const site = val[key];
            if (site) {
                const siteCard = document.createElement('div');
                siteCard.className = 'card';
                siteCard.id = 'fetch-site-id';
                const cardHeading = document.createElement('div');
                cardHeading.className = 'card-heading';
                const cardBody = document.createElement('div');
                cardBody.className = 'card-body';
                const siteName = document.createElement('h3');
                siteName.textContent = site.name;
                const siteLocation = document.createElement('h4');
                siteLocation.textContent = site.location;
                siteCard.addEventListener('click', () => {
                    const route = `/api/site-dashboard/${key}?adminId=${AdminId}&referrer=adminPage`;
                    window.location.href = route;
                })
                cardHeading.appendChild(siteName);
                siteCard.appendChild(cardHeading);
                cardBody.appendChild(siteLocation);
                siteCard.appendChild(cardBody)
                allSitesContainer.appendChild(siteCard);
            }
        });
    }
    function eventListeners(){
        if(sidebarid==='dummy-17') displayAllSites();
        else if(sidebarid==='viewsitebutton')viewAllSites();
        else if(sidebarid==='registersitebutton')registerbtn();
        else if(sidebarid==='deregistersitebutton')deregisterbtn();
    }

    function DOMContentLoaded (){
        if(sidebarid==='registersitebutton')registerDomLoad();
        else if(sidebarid==='deregistersitebutton')deregisterDomLoad();
    }

    DOMContentLoaded();
    eventListeners();
}