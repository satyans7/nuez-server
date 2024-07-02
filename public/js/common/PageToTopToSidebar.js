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
                        "id": "dummy-1",
                        "class": "sidebar-btn",
                        "text": "Dummy Button 1"
                    }
                ],
                "super-admin-navbar-admin-btn": [
                    {
                        "id": "dummy-2",
                        "class": "sidebar-btn",
                        "text": "Dummy Button 2"
                    }
                ],
                "super-admin-navbar-site-btn": [
                    {
                        "id": "dummy-3",
                        "class": "sidebar-btn",
                        "text": "Dummy Button 3"
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
                        "id": "dummy-17",
                        "class": "sidebar-btn",
                        "text": "Dummy Button 17"
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
                        "id": "viewdevices",
                        "class": "sidebar-btn",
                        "text": "View Devices"
                    }
                ],
                "site-navbar-consumer-btn": [
                    {
                        "id": "viewconsumers",
                        "class": "sidebar-btn",
                        "text": "View Consumers"
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
                        "id": "viewdevices",
                        "class": "sidebar-btn",
                        "text": "View Devices"
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
    const content = {
        "superAdmin": {
            "dummy-1": "<div id='user-list' class='list'><h2>All Consumers</h2><div class='table-container'><table><thead><tr><th>Name</th><th>Email</th><th>Details</th></tr></thead><tbody id='users-table-body'></tbody></table></div></div>",
            "dummy-2": "<div id='user-list' class='list'><h2>All Admins</h2><div class='table-container'><table><thead><tr><th>Name</th><th>Email</th><th>Details</th></tr></thead><tbody id='admins-table-body'></tbody></table></div></div>",
            "dummy-3": "<div id='site-list' class='list'><h2>All Sites</h2><div class='table-container'><table><thead><tr><th>Name</th><th>Location</th><th>Details</th></tr></thead><tbody id='sites-table-body'></tbody></table></div></div>",
            "users": "<div id='user-list' class='list'><h2>All Consumers</h2><div class='table-container'><table><thead><tr><th>Name</th><th>Email</th><th>Action</th></tr></thead><tbody id='users-table-body'></tbody></table></div></div>",
            "admins": "<div id='admin-list' class='list'><h2>All Admins</h2><div class='table-container'><table><thead><tr><th>Name</th><th>Email</th><th>Action</th></tr></thead><tbody id='admins-table-body'></tbody></table></div></div>",
            "sites": "<div id='site-list' class='list'><h2>All Sites</h2><div class='table-container'><table><thead><tr><th>Name</th><th>Location</th></tr></thead><tbody id='sites-table-body'></tbody></table></div><button id='intimate-all-btn'>Intimate All</button></div>",
            "approved": "<div id='approved-list' class='list'><h2>Approved Requests</h2><div class='table-container'><table><thead><tr><th>Name</th><th>Role Requested</th><th>TimeStamp</th></tr></thead><tbody id='approved-table-body'></tbody></table></div></div>",
            "rejected": "<div id='rejected-list' class='list'><h2>Rejected Requests</h2><div class='table-container'><table><thead><tr><th>Name</th><th>Role Requested</th><th>Timestamp</th></tr></thead><tbody id='rejected-table-body'></tbody></table></div></div>",
            "pending": "<div id='pending-list' class='list'><h2>Pending Requests</h2><div class='table-container'><table><thead><tr><th>Name</th><th>Current Role</th><th>Requested Role</th><th>Action</th></tr></thead><tbody id='pending-table-body'></tbody></table></div></div>",
            "administration": "<div id='administration-list' class='list'><h2>Administration</h2><br><div class='sync-buttons-container'><div class='sync-source-code-container'><span>SYNC SOURCE CODE</span><button id='syncSourceCode'><img src='logo/cloud_sync.svg' alt='sync'></button></div><div class='sync-firmware-container'><span>SYNC FIRMWARE</span><button id='syncFirmware'><img src='logo/sync.svg' alt=''></button></div></div></div>"
        },
        "admin": {
            "dummy-17":"<div id='site-list' class='list'><h2>Sites Under Admin</h2><div class='table-container'><table><thead><tr><th>Name</th><th>Location</th><th>Details</th></tr></thead><tbody id='sites-table-body'></tbody></table></div></div>",
            "viewsitebutton": "<div id='all-site-cards'></div>",
            "registersitebutton": "<div id='register-form-container' class='form-container'><form id='register-site-form'><label for='site-id'>Site ID:</label><input type='text' id='site-id' name='site-id' required><div class='register-search-results'></div><button type='submit'>Register</button><button type='button' id='register-cancel-button'>Cancel</button></form></div>",
            "deregistersitebutton": "<div id='deregister-form-container' class='form-container'><form id='deregister-site-form'><label for='site-id'>Site ID:</label><input type='text' id='deregister-site-id' name='site-id' required><div class='deregister-search-results'></div><button type='submit'>De-register</button><button type='button' id='deregister-cancel-button'>Cancel</button></form></div>"
        },
        "site": {
            "viewdevices":  "<div id='site-list' class='list'><h2>Devices Under Site</h2><div class='table-container'><table><thead><tr><th>Name</th><th>Location</th><th>Details</th></tr></thead><tbody id='devices-table-body'></tbody></table></div></div>",
            "viewconsumers": "<div id='site-list' class='list'><h2>Consumers Under Site</h2><div class='table-container'><table><thead><tr><th>Name</th><th>Role</th><th>Details</th></tr></thead><tbody id='consumers-table-body'></tbody></table></div></div>",
            "device":         `<div id="device-list" class="all-devices"></div>`,
            "consumer": `
        <div id="consumer-list" class="all-consumers"></div>`,
            "devicemaintenance": `
        <div id="maintenance-devices-list" class="maintenance-devices" >
            <div id="maintenance-action-tabs" class="maintenance-action-tabs">
                <button id="all-maintenance-devices">All Devices</button>
                <button id="enter-maintenance">Operational Mode</button>
                <button id="exit-maintenance">Maintenance Mode</button>
            </div>
            <div id="maintenance-container">
                <div id="all-maintenance-devices-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Device ID</th>
                                <th>Mode</th>
                            </tr>
                        </thead>
                        <tbody id="all-mode-table-body">
                        </tbody>
                    </table>
                </div>
                <div id="enter-maintenance-container">
                    <div class="operational-mode-devices">
                        <h2>Devices in Operational Mode</h2>
                        <table id="operational-mode-table">
                            <thead>
                                <tr>
                                    <th>Device ID</th>
                                </tr>
                            </thead>
                            <tbody id="operational-mode-table-body">
                            </tbody>
                        </table>
                    </div>
                    <button id="moveSelectedButton">Add</button>
                    <div class="selected-devices">
                        <h2>Selected Devices</h2>
                        <ul class="selected-device-list" id="selected-device-list-1">
                        </ul>
                        <button id="sendSelectedButton">Enter Maintenance</button>
                    </div>
                </div>
                <div id="exit-maintenance-container">
                    <div class="maintenance-mode-devices">
                        <h2>Devices in Maintenance Mode</h2>
                        <table id="maintenance-mode-table">
                            <thead>
                                <tr>
                                    <th>Device ID</th>
                                </tr>
                            </thead>
                            <tbody id="maintenance-mode-table-body">
                            </tbody>
                        </table>
                    </div>
                    <button id="moveSelectedButton-2">Add</button>
                    <div class="selected-devices">
                        <h2>Selected Devices</h2>
                        <ul class="selected-device-list" id="selected-device-list-2">
                        </ul>
                        <button id="sendSelectedButton-2">Exit Maintenance</button>
                    </div>
                </div>
            </div>
        </div>
    `,
            "editprofile": `
        <div id="edit-form-container" class="form-container" >
            <form id="edit-userForm">
                <label for="edit-name">Name:</label>
                <input type="text" id="edit-name" value="Current Name"><br><br>
                <label for="edit-location">Location:</label>
                <input type="text" id="edit-location" value="Current Location"><br><br>
                <button type="submit" id="update-button">Update</button>
            </form>
        </div>
    `,
            "unassigneddeviceslink": `
        <div id="unassigned-devices-list" class="unassigned-devices"></div>
        <div id="user-search-container" class="user-search-container" style="display:none;">
            <label for="user-search-input">Search User:</label>
            <input type="text" id="user-search-input" placeholder="Type to search...">
            <ul id="user-list">
                <!-- User list will be populated here -->
            </ul>
            <button id="assign-user-btn">Assign</button>
            <span id="cancel-search-btn">&#x2716;</span> <!-- Close Button -->
        </div>
    `,
            "firmwarelink": `
        <div id="firmware-version-list" class="firmware-version" >
            <div id="firmware-button-id" class="firmware-button-class">
                <button id="upgrade-all-versions">Upgrade All Versions</button>
                <button id="intimate-all">Intimate All</button>
            </div>
            <div id="device-versions-container">
                <!-- Device versions table will be displayed here -->
            </div>
            <select id="firmware-dropdown" size="10">
                <option value="" disabled selected>Select a firmware version</option>
            </select> 
        </div>
    `
        },
        "consumer": {
            "viewdevices": "<div id='site-list' class='list'><h2>Devices Under Site</h2><div class='table-container'><table><thead><tr><th>Name</th><th>Location</th><th>Details</th></tr></thead><tbody id='devices-table-body'></tbody></table></div></div>",
            "device-under-consumer-advanced": `<div class="all-devices"></div>`,
            "register-device-for-consumer": `<div id='registerdevice-form-container' class='form-container'><form id='register-device-form'><label for='device-id'>Device ID:</label><input type='text' id='register-device-id' name='register-device-id' required><div class='register-search-results'></div><button type='submit'>Register</button><button type='button' id='register-device-cancel-button'>Cancel</button></form></div>`,
            "deregister-device-for-consumer": `<div id='deregisterdevice-form-container' class='form-container'><form id='deregister-device-form'><label for='device-id'>Device ID:</label><input type='text' id='deregister-device-id' name='deregister-device-id' required><div class='deregister-search-results'></div><button type='submit'>De-Register</button><button type='button' id='deregister-device-cancel-button'>Cancel</button></form></div>`,

        }
    }

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








