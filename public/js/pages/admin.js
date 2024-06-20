import { getSitesData, getUserSiteMapping,registerDevice,registerSite,deregisterSite } from '../client/client.js';
document.addEventListener('DOMContentLoaded', async () => {
    document.getElementById('logout-link').addEventListener("click",(event)=>{
        window.location.href="/logout"
    })
});
const allSitesContainer = document.querySelector('.all-sites');
const registerTab = document.getElementById('register-form-container');
const deregisterTab = document.getElementById('deregister-form-container');
const registerBtn = document.getElementById('register-site-button');
const deregisterBtn = document.getElementById('deregister-site-button');
const viewSitesBtn = document.getElementById('view-site-button')
const headingText = document.getElementById('heading');
const currentAdmin = document.getElementById('admin-id')
const deregisterform= document.getElementById('deregister-site-form')

const title = document.createElement('h1');
title.textContent = `Welcome, ${getCurrentAdmin()}`
headingText.appendChild(title)

const currentid = document.createElement('h1');
currentid.textContent = `Id : ${getCurrentAdmin()}`
currentAdmin.appendChild(currentid)


//REGISTER SITE

function populateSearchContainer(data, searchResultsContainer, siteIdInput){
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


document.addEventListener('DOMContentLoaded', async () => {
    const searchResultsContainer = document.querySelector(".register-search-results");
    const siteIdInput = document.getElementById("site-id");
    const data = await getSitesData();
    const ids = Object.keys(data);
    populateSearchContainer(ids, searchResultsContainer, siteIdInput);
});

registerBtn.addEventListener('click', () => {
    allSitesContainer.style.display = 'none';
    deregisterTab.style.display = 'none';
    registerTab.style.display = 'block';
    const form = document.getElementById('register-site-form');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const user = getCurrentAdmin();
        const ob = {
            site: document.getElementById('site-id').value
        }

        const res = await registerSite(ob, user);
        viewAllSites();
        alert(res.message);
        form.reset();
    }); 
    
    document.getElementById('register-cancel-button').addEventListener('click', () => {
        deregisterTab.style.display = 'none';
        allSitesContainer.style.display = 'block';
        registerTab.style.display = 'block';
        viewAllSites();
    });
});



//DEREGISTER SITE

document.addEventListener('DOMContentLoaded', async () => {
    const searchResultsContainer = document.querySelector(".deregister-search-results");
    const siteIdInput = document.getElementById("deregister-site-id");
    const user = getCurrentAdmin();
    const sites = await getUserSiteMapping();
    const ids = sites[user];
    populateSearchContainer(ids, searchResultsContainer, siteIdInput);
});

deregisterBtn.addEventListener('click', () => {
    allSitesContainer.style.display = 'none';
    registerTab.style.display = 'none';
    deregisterTab.style.display = 'block';
   
    document.getElementById('deregister-site-form').addEventListener('submit', async (event) => {
        event.preventDefault();
      
        const siteId = document.getElementById('deregister-site-id').value;
        const user= getCurrentAdmin();
        console.log(siteId);
        const object={
            site: siteId
        }
    
        try {
          const response = await deregisterSite(user,object);
          viewAllSites();
        alert(response.message);
        deregisterform.reset();
        
        } catch (error) {
          console.error('Error deregistering site:', error);
          alert(`${error.message}`);
        }
      });

      //when cancel button is clicked
      document.getElementById('deregister-cancel-button').addEventListener('click', () => {
        deregisterTab.style.display = 'none';
        allSitesContainer.style.display = 'block';
        registerTab.style.display = 'block';
        viewAllSites();
    });

})

viewSitesBtn.addEventListener('click', async() => {
    await viewAllSites();
})
document.addEventListener('DOMContentLoaded', async () => {
    await viewAllSites();

});

function getCurrentAdmin() {
    const fullUrl = window.location.href;
    const url = new URL(fullUrl);
    const pathname = url.pathname;
    const segments = pathname.split('/');
    const userId = segments[segments.length - 1];
    return userId;
};



async function viewAllSites() {
    deregisterTab.style.display = 'none';
    registerTab.style.display = 'none';
    allSitesContainer.style.display = 'flex';
    const AdminId = getCurrentAdmin();
    console.log(AdminId)
    const sitesData = await getSitesData();
    const usersSitesMapping = await getUserSiteMapping();
    let sites = [];
    sites = usersSitesMapping[AdminId];
    allSitesContainer.innerHTML = '';
    sites.forEach(key => {
        const site = sitesData[key];
        if (site) {
            const siteCard = document.createElement('div');
            siteCard.className = 'card';
            const cardHeading = document.createElement('div');
            cardHeading.className = 'card-heading';
            const cardBody = document.createElement('div');
            cardBody.className = 'card-body';
            const siteName = document.createElement('h3');
            siteName.textContent = site.name;
            const siteLocation = document.createElement('h4');
            siteLocation.textContent = site.location;
            const moreDetailsButton = document.createElement('button');
            moreDetailsButton.id = 'fetch-site-data';
            moreDetailsButton.textContent = 'More Details';
            moreDetailsButton.addEventListener('click', () => {
                const route = `/api/site-dashboard/${key}?adminId=${getCurrentAdmin()}&referrer=adminPage`;
                window.location.href = route;
            })
            cardHeading.appendChild(siteName);
            cardHeading.appendChild(moreDetailsButton);
            siteCard.appendChild(cardHeading);
            cardBody.appendChild(siteLocation);
            siteCard.appendChild(cardBody)
            allSitesContainer.appendChild(siteCard);
        }
    });
}


