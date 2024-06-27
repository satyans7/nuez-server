import { initializeSuperAdminPanel } from '../pages/superAdmin.js';
import { initializeAdminPanel } from '../pages/admin.js';
import { initializeSitePanel } from '../pages/siteToDevice.js';

function getPageIdentifier() {
    const path = window.location.pathname;

    if (path.includes("admin-dashboard")) {
        return "admin";
    } else if (path.includes("site-dashboard")) {
        return "site";
    } else if (path.includes("superadmin")) {
        return "superAdmin";
    }

    return ""; // Default or error case
}

document.addEventListener("DOMContentLoaded", function () {
    const data = {
        "superAdmin": {
            "navbarButtons": [
                {
                    "id": "super-admin-navbar-consumer-btn",
                    "class": "super-admin-navbar-consumer-btn",
                    "html": "<img src=\"/logo/consumer.svg\" alt=\"CONSUMER\">"
                },
                {
                    "id": "super-admin-navbar-admin-btn",
                    "class": "super-admin-navbar-admin-btn",
                    "html": "<img src=\"/logo/admin.svg\" alt=\"ADMIN\">"
                },
                {
                    "id": "super-admin-navbar-site-btn",
                    "class": "super-admin-navbar-site-btn",
                    "html": "<img src=\"/logo/site.svg\" alt=\"SITES\">"
                },
                {
                    "id": "super-admin-navbar-advance-btn",
                    "class": "super-admin-navbar-advance-btn",
                    "html": "<img src=\"/logo/advance.svg\" alt=\"ADVANCE\">"
                }
            ],
            "sidebarButtons": {
                "super-admin-navbar-consumer-btn": [
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
                "super-admin-navbar-admin-btn": [
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
                "super-admin-navbar-site-btn": [
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
                "super-admin-navbar-advance-btn": [
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
        },
        "admin": {
            "navbarButtons": [
                {
                    "id": "admin-navbar-site-btn",
                    "class": "admin-navbar-site-btn",
                    "html": "<img src=\"/logo/site.svg\" alt=\"SITES\">"
                },
                {
                    "id": "admin-navbar-advance-btn",
                    "class": "admin-navbar-advance-btn",
                    "html": "<img src=\"/logo/advance.svg\" alt=\"ADVANCE\">"
                }
            ],
            "sidebarButtons": {
                "admin-navbar-site-btn": [
                    {
                        "id": "dummy-17",
                        "class": "sidebar-btn",
                        "text": "Dummy Button 17"
                    },
                    {
                        "id": "dummy-18",
                        "class": "sidebar-btn",
                        "text": "Dummy Button 18"
                    }
                ],
                "admin-navbar-advance-btn": [
                    {
                        "id": "view-site-button",
                        "class": "sidebar-btn",
                        "text": "All Sites"
                    },
                    {
                        "id": "register-site-button",
                        "class": "sidebar-btn",
                        "text": "Register"
                    },
                    {
                        "id": "deregister-site-button",
                        "class": "sidebar-btn",
                        "text": "Deregister"
                    }
                ]
            }
        },
        "site": {
            "navbarButtons": [
                {
                    "id": "site-navbar-device-btn",
                    "class": "site-navbar-device-btn",
                    "html": "<img src=\"/logo/device.svg\" alt=\"DEVICES\">"
                },
                {
                    "id": "site-navbar-consumer-btn",
                    "class": "site-navbar-consumer-btn",
                    "html": "<img src=\"/logo/consumer.svg\" alt=\"CONSUMER\">"
                },
                {
                    "id": "site-navbar-advance-btn",
                    "class": "site-navbar-advance-btn",
                    "html": "<img src=\"/logo/advance.svg\" alt=\"ADVANCE\">"

                }
            ],
            "sidebarButtons": {
                "site-navbar-device-btn": [
                    {
                        "id": "device-tab",
                        "class": "sidebar-btn",
                        "text": "All Devices"
                    }
                ],
                "site-navbar-consumer-btn": [
                    {
                        "id": "consumer-tab",
                        "class": "sidebar-btn",
                        "text": "All Consumers"
                    }
                ],
                "site-navbar-advance-btn": [
                    {
                        "id": "device-tab",
                        "class": "sidebar-btn",
                        "text": "All Devices"
                    },
                    {
                        "id": "consumer-tab",
                        "class": "sidebar-btn",
                        "text": "All Consumers"
                    },
                    {
                        "id": "device-maintenance-tab",
                        "class": "sidebar-btn",
                        "text": "Maintenance"
                    },
                    {
                        "id": "edit-profile",
                        "class": "sidebar-btn",
                        "text": "Edit Profile"
                    },
                    {
                        "id": "unassigned-devices-link",
                        "class": "sidebar-btn",
                        "text": "Unassigned Devices"
                    },
                    {
                        "id": "firmware-link",
                        "class": "sidebar-btn",
                        "text": "Firmware"
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
            return `
                <div class="button-container">
                    <button id="${button.id}" class="${button.class}">${button.html || button.text}</button>
                    <span class="button-description">${button.text || ''}</span>
                </div>`;
        }).join('');
    }

    // Function to render sidebar buttons
    function renderSidebarButtons(buttons) {
        return buttons.map(button => {
            console.log(button);
            return `<button id="${button.id}" class="${button.class}">${button.text}</button>`;
        }).join('');
    }

    // Function to initialize the topbar buttons
    function initializeTopbarButtons(data) {
        let page = getPageIdentifier();
        console.log(page);

        if (page === 'superAdmin' || page === 'admin' || page==='site') {
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
                            // Handle button click action
                            console.log(`Button ${button.id} clicked.`);
                            const sidebarButtons = pageData.sidebarButtons[button.id];
                            if (leftSidebar) {
                                leftSidebar.innerHTML = renderSidebarButtons(sidebarButtons);
                                if (page === 'superAdmin') {
                                    initializeSuperAdminPanel();
                                } else if (page === 'admin') {
                                    initializeAdminPanel();
                                }else if(page === 'site'){
                                    initializeSitePanel();
                                }
                            }
                        });
                    }
                });

                // Set default active button state
                const defaultButton = document.getElementById(navbarButtons[0].id);
                if (defaultButton) {
                    defaultButton.click();
                }
            }
        }
    }

    // Initialize the topbar buttons on page load
    initializeTopbarButtons(data);
});
