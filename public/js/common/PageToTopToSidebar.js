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

document.addEventListener("DOMContentLoaded", async function () {
    const data ={
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
                        "id": "users",
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
                        "id": "users",
                        "class": "sidebar-btn",
                        "text": "All Consumers"
                    },
                    {
                        "id": "admins",
                        "class": "sidebar-btn",
                        "text": "All Admins"
                    },
                    {
                        "id": "sites",
                        "class": "sidebar-btn",
                        "text": "All Sites"
                    },
                    {
                        "id": "approved",
                        "class": "sidebar-btn",
                        "text": "Approved Requests"
                    },
                    {
                        "id": "rejected",
                        "class": "sidebar-btn",
                        "text": "Rejected Requests"
                    },
                    {
                        "id": "pending",
                        "class": "sidebar-btn",
                        "text": "Pending Requests"
                    },
                    {
                        "id": "administration",
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
                        "id": "viewsitebutton",
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
                        "id": "viewsitebutton",
                        "class": "sidebar-btn",
                        "text": "All Sites"
                    },
                    {
                        "id": "registersitebutton",
                        "class": "sidebar-btn",
                        "text": "Register"
                    },
                    {
                        "id": "deregistersitebutton",
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
                        "id": "device",
                        "class": "sidebar-btn",
                        "text": "All Devices"
                    }
                ],
                "site-navbar-consumer-btn": [
                    {
                        "id": "consumer",
                        "class": "sidebar-btn",
                        "text": "All Consumers"
                    }
                ],
                "site-navbar-advance-btn": [
                    {
                        "id": "device",
                        "class": "sidebar-btn",
                        "text": "All Devices"
                    },
                    {
                        "id": "consumer",
                        "class": "sidebar-btn",
                        "text": "All Consumers"
                    },
                    {
                        "id": "devicemaintenance",
                        "class": "sidebar-btn",
                        "text": "Maintenance"
                    },
                    {
                        "id": "editprofile",
                        "class": "sidebar-btn",
                        "text": "Edit Profile"
                    },
                    {
                        "id": "unassigneddeviceslink",
                        "class": "sidebar-btn",
                        "text": "Unassigned Devices"
                    },
                    {
                        "id": "firmwarelink",
                        "class": "sidebar-btn",
                        "text": "Firmware"
                    }
                ]
            }

        },
        "consumer": {
            "navbarButtons": [
                {
                    "id": "consumer-navbar-device-btn",
                    "class": "consumer-navbar-device-btn",
                    "html": "<img src=\"/logo/device.svg\" alt=\"DEVICES\">"
                },
                {
                    "id": "consumer-navbar-advance-btn",
                    "class": "consumer-navbar-advance-btn",
                    "html": "<img src=\"/logo/advance.svg\" alt=\"ADVANCE\">"

                }
            ],
            "sidebarButtons": {
                "consumer-navbar-device-btn": [
                    {
                        "id": "device-under-consumer",
                        "class": "sidebar-btn",
                        "text": "All Devices"
                    }
                ],
                "consumer-navbar-advance-btn": [
                    {
                        "id": "device-under-consumer-advanced",
                        "class": "sidebar-btn",
                        "text": "All Devices"
                    },
                    {
                        "id": "register-device-for-consumer",
                        "class": "sidebar-btn",
                        "text": "Register"
                    },
                    {
                        "id": "deregister-device-for-consumer",
                        "class": "sidebar-btn",
                        "text": "Deregister"
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
      
      // Example usage
     async function loadFragment(role, key) {
        const fragment = await fetchHtmlFragment(role, key);
        if (fragment) {
          document.querySelector(".main-content").innerHTML = fragment.content;
          document.querySelector('.right-side-bar').innerHTML = fragment.help;
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

    // Initialize the topbar buttons on page load
    initializeTopbarButtons(data);
});
