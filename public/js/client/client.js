import * as controller from "./controller.js";
//import * as register from "../pages/register.js";
// const button = document.getElementById("fetch-data-from-server");

// button.addEventListener("click", () => {
//     controller.fetchAllDataFromServer();
// })

export function postUserDataToServer(formData) {
    console.log("fetched")
    controller.postUserDataToServer(formData);
    
}


// Super Admin 

export async function getAllUsers() {
    const data =  await controller.fetchAllUsersFromServer()
    //console.log(data)
    return data
}


export async function getAllPendingRequests() {
    const data = await controller.fetchPendingRequestsFromServer()
    //console.log(data)
    return data
}

export function getAllApprovedRequests() {
    console.log('Fetching all approved requests');
}


export function getAllRejectedRequests() {
    console.log('Fetching all rejected requests');

}

