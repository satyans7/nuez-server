import * as controller from "./controller.js";

// const button = document.getElementById("fetch-data-from-server");

// button.addEventListener("click", () => {
//     controller.fetchAllDataFromServer();
// })


// Super Admin 

export async function getAllUsers() {
    const data =  await controller.fetchAllUsersFromServer()
    //console.log(data)
    return data
}

export function getAllApprovedRequests() {
    console.log('Fetching all approved requests');
}


export function getAllRejectedRequests() {
    console.log('Fetching all rejected requests');

}

export function getAllPendingRequests() {
    console.log('Fetching all pending requests');

}
