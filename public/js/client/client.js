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

export async function getAllConsumers() {
    const data =  await controller.fetchAllConsumersFromServer()
   // console.log(data)
    return data
}

export async function getAllAdmins() {
    const data =  await controller.fetchAllAdminsFromServer()
   // console.log(data)
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

export async function postRequesttoRoleChange(id, request) {
    console.log(`posting the request ${id}`)
    await controller.postRequestToRoleChangeToServer(id, request);
}


export async function postapproveRoleChange(id,request) {
    console.log(`posting the approval request ${id}`);
    await controller.postapproveRoleChange(id,request);
}
 
export async function postrejectRoleChange(id,request) {
    console.log(`posting the reject request ${id}`);
    await controller.postrejectRoleChange(id,request);
}


//login
export async function userLoginDetailsPost(userData){
    return await controller.postUserLoginDataToServer(userData);
}

// generate otp
export async function generateOTP(email){
    return await controller.generateOTP(email);
}

export async function verifyOTP(email,otp){
    return await controller.verifyOTP(email,otp);
}
