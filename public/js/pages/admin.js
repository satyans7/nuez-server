import { getSitesData, getUserSiteMapping } from '../client/client.js';

const allSitesContainer = document.querySelector('.all-sites');
const registerTab = document.getElementById('register-form-container');
const deregisterTab = document.getElementById('deregister-form-container');
const registerBtn = document.getElementById('register-site-button');
const deregisterBtn = document.getElementById('deregister-site-button');
const viewSitesBtn = document.getElementById('view-site-button')
const headingText = document.getElementById('heading');
const currentAdmin = document.getElementById('admin-id')

const title = document.createElement('h1');
title.textContent = `Welcome, ${getCurrentAdmin()}`
headingText.appendChild(title)

const currentid = document.createElement('h1');
currentid.textContent = `Id : ${getCurrentAdmin()}`
currentAdmin.appendChild(currentid)


registerBtn.addEventListener('click', () => {
    allSitesContainer.style.display = 'none';
    deregisterTab.style.display = 'none';
    registerTab.style.display = 'block';
})

deregisterBtn.addEventListener('click', () => {
    allSitesContainer.style.display = 'none';
    registerTab.style.display = 'none';
    deregisterTab.style.display = 'block';
})

viewSitesBtn.addEventListener('click', async () => {
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
            moreDetailsButton.addEventListener('click', ()=>{
                const route = `/api/site-dashboard/${key}`;
                window.open(route, '_blank')
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


