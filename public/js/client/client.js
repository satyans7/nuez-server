import * as controller from "./controller.js";
//import * as register from "../pages/register.js";
// const button = document.getElementById("fetch-data-from-server");
// fetchDataBtn.addEventListener("click", () => {
//     controller.fetchAllDataFromServer();
// })


export function postUserDataToServer(formData) {
    return controller.postUserRegisterDataToServer(formData);
    
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

export async function getAllApprovedRequests() {
    const data = await controller.fetchApprovedRequests();
    //console.log('Approved Requests:', data);
    return data
}


export async function getAllRejectedRequests() {
    const data = await controller.fetchDeniedRequests();
    //console.log('Denied Requests:', data);
    return data
}

export function postRequesttoRoleChange(id, request) {
    console.log(`posting the request ${id}`)
    controller.postRequestToRoleChangeToServer(id, request);
}




//login
export function userLoginDetailsPost(userData){
    return controller.postUserLoginDataToServer(userData);
}


export function postapproveRoleChange(id,request) {
    console.log(`posting the approval request ${id}`);
    controller.postapproveRoleChange(id,request);
}
 
export function postrejectRoleChange(id,request) {
    console.log(`posting the reject request ${id}`);
    controller.postrejectRoleChange(id,request);
}