import { initializeSuperAdminPanel } from '../pages/superAdmin.js';
import { initializeAdminPanel } from '../pages/admin.js';
import { initializeSitePanel } from '../pages/siteToDevice.js';
import { initializeConsumerPanel } from '../pages/consumer.js';

function getPageIdentifier() {
    const path = window.location.pathname;

    if (path.includes("admin-dashboard")) {
        return "admin";
    } else if (path.includes("site-dashboard")) {
        return "site";
    } else if (path.includes("superAdmin")) {
        return "superAdmin";
    } else if (path.includes("consumer-dashboard")) {
        return "consumer";
    }
    return ""; // Default or error case
}
const AEP_TO_GET_BUTTON_MAPPING='/api/buttonMapping'
 async function getButtonMapFromServer(){
    try {
        const response =  await fetch(AEP_TO_GET_BUTTON_MAPPING);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data =  response.json();
        return data;
      } catch (error) {
        console.error("Error fetching data:", error);
        return null;
      }
}
document.addEventListener("DOMContentLoaded", async function () {
    const data = await getButtonMapFromServer();
    if (data) {
        initializeNavbar(data);
    } else {
        console.error("Failed to fetch button mapping data.");
    }
});

async function initializeNavbar(data){
    const topbarMiddle = document.querySelector(".topbar-middle");
    const leftSidebar = document.querySelector(".left-side-bar");

    // Function to render navbar buttons
    function renderNavbarButtons(buttons) {
        return buttons.map(button => {
            return `
                <div class="button-container">
                    <button id="${button.id}" class="${button.class}">${button.html || button.text}</button>
                    <span class="button-description">${button.text || ''}</span>
                </div>`;
        }).join('');
    }

    // Function to render sidebar buttons
    function renderSidebarButtons(buttons) {
        const page = getPageIdentifier();
        const queryParams = new URLSearchParams(window.location.search);
        const adminId = queryParams.get('adminId');
        return buttons.map(button => {
            if (page === "consumer" && !adminId) {
                if (button.text !== 'Register' && button.text !== 'Deregister') {
                    return `<button id="${button.id}" class="${button.class}">${button.text}</button>`;
                }
            }
            else return `<button id="${button.id}" class="${button.class}">${button.text}</button>`;
        }).join('');
    }
    async function fetchHtmlFragment(role, key) {
        try {
          const response = await fetch(`/api/html/${role}/${key}`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          return data;
        } catch (error) {
          console.error('Failed to fetch HTML fragment:', error);
          return null;
        }
      }
      
      async function loadFragment(role, key) {
        const fragment = await fetchHtmlFragment(role, key);
        if (fragment) {
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = fragment.fragment;
      
          const content = tempDiv.querySelector('.content').outerHTML;
          const help = tempDiv.querySelector('.help').outerHTML;
      
          document.querySelector(".main-content").innerHTML = content;
          document.querySelector('.right-side-bar').innerHTML = help;
        }
      }
      

    // Function to initialize the topbar buttons
    function initializeTopbarButtons(data) {
        let page = getPageIdentifier();

        if (page === 'superAdmin' || page === 'admin' || page === 'site' || page === 'consumer') {
            const pageData = data[page];
            const navbarButtons = pageData.navbarButtons;

            // Render navbar buttons
            if (topbarMiddle) {
                topbarMiddle.innerHTML = renderNavbarButtons(navbarButtons);

                // Event listener for navbar buttons
                navbarButtons.forEach(button => {
                    const btnElement = document.getElementById(button.id);
                    if (btnElement) {
                        btnElement.addEventListener("click", function () {
                        
                            const sidebarButtons = pageData.sidebarButtons[button.id];
                            if (leftSidebar) {
                                leftSidebar.innerHTML = renderSidebarButtons(sidebarButtons);
                                sidebarButtons.forEach(sideButton => {
                                    const btn = document.getElementById(sideButton.id);
                                    btn.addEventListener("click", async () => {
                                        if (page === 'superAdmin') {
                                            await loadFragment(page , sideButton.id); // Ensure page variable is correct
                                            initializeSuperAdminPanel(sideButton.id); // Double-check this function
                                        } else if (page === 'admin') {
                                            await loadFragment(page , sideButton.id);
                                            initializeAdminPanel(sideButton.id); // Verify if needed
                                        } else if (page === 'site') {
                                            await loadFragment(page , sideButton.id);
                                            initializeSitePanel(sideButton.id); // Verify if needed
                                        } else if (page === 'consumer') {
                                            await loadFragment(page , sideButton.id);
                                            initializeConsumerPanel(sideButton.id);
                                        }
                                    });
                                });


                            }
                        });
                    }
                });

                // Set default active button state
                const defaultButtonTop = document.getElementById(navbarButtons[0].id);
                if (defaultButtonTop) {
                    defaultButtonTop.click();

                    // Set the default active sidebar button
                    const firstSidebarButtonId = pageData.sidebarButtons[navbarButtons[0].id][0].id;
                    const firstSidebarButton = document.getElementById(firstSidebarButtonId);
                    if (firstSidebarButton) {
                        firstSidebarButton.click();
                    }
                }
            }
        }
    }
    const logoutBtn=document.querySelector(".logout-btn");
    logoutBtn.addEventListener("click",()=>{
        window.location.href="/logout";
    })
    // Initialize the topbar buttons on page load
    initializeTopbarButtons(data);
}








