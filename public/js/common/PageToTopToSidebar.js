import { initializeSuperAdminPanel } from '../pages/superAdmin.js';

document.addEventListener("DOMContentLoaded", function() {
    const data = {
        "superAdmin": {
            "navbarButtons": [
                {
                    "id": "consumer-navbar-btn",
                    "class": "navbar-btn",
                    "html": "<img src=\"logo/consumer.svg\" alt=\"CONSUMER\">"
                },
                {
                    "id": "admin-navbar-btn",
                    "class": "navbar-btn",
                    "html": "<img src=\"logo/admin.svg\" alt=\"ADMIN\">"
                },
                {
                    "id": "site-navbar-btn",
                    "class": "navbar-btn",
                    "html": "<img src=\"logo/site.svg\" alt=\"SITES\">"
                },
                {
                    "id": "advance-navbar-btn",
                    "class": "navbar-btn",
                    "html": "<img src=\"logo/advance.svg\" alt=\"ADVANCE\">"
                }
            ],
            "sidebarButtons": {
                "consumer-navbar-btn": [
                    {
                        "id": "dummy-7",
                        "class": "sidebar-btn",
                        "text": "Dummy Button 7"
                    },
                    {
                        "id": "dummy-8",
                        "class": "sidebar-btn",
                        "text": "Dummy Button 8"
                    }
                ],
                "admin-navbar-btn": [
                    {
                        "id": "dummy-9",
                        "class": "sidebar-btn",
                        "text": "Dummy Button 9"
                    },
                    {
                        "id": "dummy-10",
                        "class": "sidebar-btn",
                        "text": "Dummy Button 10"
                    }
                ],
                "site-navbar-btn": [
                    {
                        "id": "dummy-11",
                        "class": "sidebar-btn",
                        "text": "Dummy Button 11"
                    },
                    {
                        "id": "dummy-12",
                        "class": "sidebar-btn",
                        "text": "Dummy Button 12"
                    }
                ],
                "advance-navbar-btn": [
                    {
                        "id": "users-tab",
                        "class": "sidebar-btn",
                        "text": "All Consumers"
                    },
                    {
                        "id": "admins-tab",
                        "class": "sidebar-btn",
                        "text": "All Admins"
                    },
                    {
                        "id": "sites-tab",
                        "class": "sidebar-btn",
                        "text": "All Sites"
                    },
                    {
                        "id": "approved-tab",
                        "class": "sidebar-btn",
                        "text": "Approved Requests"
                    },
                    {
                        "id": "rejected-tab",
                        "class": "sidebar-btn",
                        "text": "Rejected Requests"
                    },
                    {
                        "id": "pending-tab",
                        "class": "sidebar-btn",
                        "text": "Pending Requests"
                    },
                    {
                        "id": "administration-tab",
                        "class": "sidebar-btn",
                        "text": "Administration"
                    }
                ]
            }
        }
    };

    const topbarMiddle = document.querySelector(".topbar-middle");
    const leftSidebar = document.querySelector(".left-side-bar");

    // Function to render navbar buttons
    function renderNavbarButtons(buttons) {
        return buttons.map(button => {
            if (button.html) {
                return `
                    <div class="button-container">
                        <button id="${button.id}" class="${button.class}">${button.html}</button>
                        <span class="button-description">${button.text}</span>
                    </div>`;
            } else {
                return `
                    <div class="button-container">
                        <button id="${button.id}" class="${button.class}">${button.text}</button>
                        <span class="button-description">${button.text}</span>
                    </div>`;
            }
        }).join('');
    }
    

    // Function to render sidebar buttons
    function renderSidebarButtons(buttons) {
        
        return buttons.map(button => {
            console.log(button)
            return `<button id="${button.id}" class="${button.class}">${button.text}</button>`;
        }).join('');
    }

    // Function to initialize the topbar buttons
    function initializeTopbarButtons(data) {
        const superAdminButtons = data.superAdmin.navbarButtons;

        // Render super admin buttons
        topbarMiddle.innerHTML = renderNavbarButtons(superAdminButtons);

        // Event listener for super admin buttons
        superAdminButtons.forEach(button => {
            const btnElement = document.getElementById(button.id);
            btnElement.addEventListener("click", function() {
                // Handle button click action
                console.log(`Button ${button.id} clicked.`);
                const sidebarButtons = data.superAdmin.sidebarButtons[button.id];
                leftSidebar.innerHTML = renderSidebarButtons(sidebarButtons);
                initializeSuperAdminPanel();
            });
        });

        // Set default active button state
        document.getElementById(superAdminButtons[0].id).click();
    }

    // Initialize the topbar buttons on page load
    initializeTopbarButtons(data);
});
