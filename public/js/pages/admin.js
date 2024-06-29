import { getSitesData, getUserSiteMapping, registerDevice, registerSite, deregisterSite, getAllSitesUnderAdmin } from '../client/client.js';


export function initializeAdminPanel(sidebarid) {
    const allSitesContainer = document.getElementById('all-site-cards');
    const registerTab = document.getElementById('register-form-container');
    const deregisterTab = document.getElementById('deregister-form-container');
    const deregisterform = document.getElementById('deregister-site-form')

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
        if(sidebarid==='viewsitebutton')viewAllSites();
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

