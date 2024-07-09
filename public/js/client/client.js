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
    const data = await controller.fetchAllConsumersFromServer()
    // console.log(data)
    return data
}

export async function getAllAdmins() {
    const data = await controller.fetchAllAdminsFromServer()
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


export async function postapproveRoleChange(id, request) {
    console.log(`posting the approval request ${id}`);
    await controller.postapproveRoleChange(id, request);
}

export async function postrejectRoleChange(id, request) {
    console.log(`posting the reject request ${id}`);
    await controller.postrejectRoleChange(id, request);
}


//login
export async function userLoginDetailsPost(userData) {
    return await controller.postUserLoginDataToServer(userData);
}

// generate otp
export async function generateOTP(email){
    return await controller.generateOTP(email);
}

export async function verifyOTP(email,otp){
    return await controller.verifyOTP(email,otp);
}

// Site - Admin 

export async function getSitesData() {
    return await controller.getAllSitesData();
}
export async function getUserSiteMapping() {
    return await controller.getUserToSiteMapping();
}

export async function getAllSitesUnderAdmin(id){
    return await controller.getAllSitesUnderAdmin(id);
}


//SITE DEVICE PAGE
export async function getDevicesData() {
    return await controller.getAllDevicesData();
}

export async function getDeviceData(id) {
    return await controller.getDeviceData(id);
}
//SITE DEVICE MAPPING
export async function getSiteDeviceMapping() {
    return await controller.getSiteToDeviceMapping();
}

export async function getSiteConsumerMapping() {
    return await controller.getSiteToConsumerMapping();
}

export async function getAllDevicesUnderSite(id){
    return await controller.getAllDevicesUnderSite(id);
}
export async function getAllConsumersUnderSite(id){
    return await controller.getAllConsumersUnderSite(id);
}


//Updating site info
export async function updateSiteDataOnServer(data, id){
    return await controller.updateSiteDataOnServer(data, id);

}

//Consumer
export async function getConsumerDeviceMapping() {
    const data =  await controller.getConsumerToDeviceMapping();
 //   console.log(data)
    return data
}


//
export async function getAllAdminKeys() {
    const response = await controller.fetchAllAdminsFromServer();
    const data = await response.json();
    return Object.keys(data); // Return the keys (user IDs) from the response
}


//device profile update
export async function updateDeviceData(id, request) {
    console.log(`updating details for device with id: ${id}`);
   return await controller.updateDevice(id, request);
}


export async function registerSite(data,id)
{
    
    return await controller.registerSite(data,id);
}

export async function registerDevice(data,id)
{
    return await controller.registerDevice(data,id);
}

//Site to consumer
export async function registerConsumer(id, data) {
    return await controller.registerConsumer(id, data);
}

export async function deregisterConsumer(id, data) {
    return await controller.deregisterConsumer(id, data);
}

//DELETE SITE DEVICE MAPPING
export async function deleteSiteToDeviceMapping(id,request) {
    return await controller.deleteSiteToDeviceMapping(id,request);
  }

export async function deregisterSite(id,data)
{
    const response= await controller.deregisterSite(id,data);

    return response;
}




//register consumer device mapping
export async function registerConsumerDeviceMapping(data,id)
{
    return await controller.registerConsumerDevice(data,id);
}

//deregister consumer device mapping
export async function deregisterConsumerDeviceMapping(id,data)
{
    const response= await controller.deregisterConsumerDevice(id,data);
    return response;
}

//assign a device to an existing user
export async function assignDeviceToUser(id,data)
{
    const response= await controller.assignDeviceToUser(id,data);
    return response;
}


//device profile creation
export async function postDeviceData(id, request) {
    console.log(`Posting details for device with id: ${id}`);
   return await controller.postDevice(id, request);
}

export async function syncFirmwareData(){
    await controller.syncFirmwareData();
}
export async function syncSourceCode(){
    await controller.syncSourceCode();
}

export async function sendFirmwareToSites(){
    await controller.sendFirmwareToSites();
}

//Maintenance

export async function getDeviceStatus(object){
    return await controller.getDeviceStatus(object);
}

export async function enterMaintenance(object){
    return await controller.enterMaintenance(object);
}

export async function exitMaintenance(object){
    const res = await controller.exitMaintenance(object);
    console.log(res);
    return res;
}

