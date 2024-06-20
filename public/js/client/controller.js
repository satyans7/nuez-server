import * as cep from "./client-end-point.js";

export async function fetchAllDataFromServer() {
    const api = cep.getApiToFetchSampleDataFromServer();
    let res = await cep.getDataFromServer(api);
    console.log(res);

}

export async function postUserRegisterDataToServer(data) {
    const api = cep.getApiToRegisterUser();
    return await cep.fetchPost(api, data);
}
export async function postUserLoginDataToServer(data) {
    const api = cep.getApiToAuthenticateUser();
    return await cep.fetchPost(api, data);
}


//Super Admin

export async function fetchAllConsumersFromServer() {
    const api = cep.getApiToFetchConsumerDetailsForAll();
    let res = await cep.fetchDataFromServer(api);
    //console.log(res);
    return res;
}

export async function fetchAllAdminsFromServer() {
    const api = cep.getApiToFetchAdminDetailsForAll();
    let res = await cep.fetchDataFromServer(api);
    //console.log(res);
    return res;
}

export async function fetchApprovedRequests() {
    const api = cep.getApiToFetchApprovedLog();
    let res = await cep.fetchDataFromServer(api);
    console.log(res);
    return res;
}
export async function fetchDeniedRequests() {
    const api = cep.getApiToFetchDeniedLog();
    let res = await cep.fetchDataFromServer(api);
    console.log(res);
    return res;
}

export async function fetchPendingRequestsFromServer() {
    const api = cep.getApiToRoleChangeRequest();
    let res = await cep.fetchDataFromServer(api);
    console.log(res);
    return res;
}


export async function postRequestToRoleChangeToServer(id, data) {
    const api = await cep.getApiToRequestRoleChange(id);
    cep.fetchPost(api, data);
}


export async function postapproveRoleChange(id, data) {
    const api = await cep.getApiToApproveRoleChange(id);
    cep.fetchPost(api, data);
    //console.log(id);
}

export async function postrejectRoleChange(id, data) {
    const api = await cep.getApiToRejectRoleChange(id);
    cep.fetchPost(api, data);
    //console.log(id);
}

export async function generateOTP(email) {
    const api = await cep.getApiToGenerateOTP();
    const data={
        "email":email
    }
    return await  cep.fetchPost(api,data);
}

export async function verifyOTP(email,otp) {
    const api = await cep.getApiToVerifyOTP();
    const data={
        "email":email,
        "otp":otp
    }
   return await cep.fetchPost(api,data);
    //console.log(id);
}





// Site - Admin 

export async function getAllSitesData(){
    const api = cep.getApitoFetchAllSitesData();
    return await cep.fetchDataFromServer(api);
}

export async function getUserToSiteMapping(){
    const api = cep.getApiToFetchAdminSiteMapping();
    return await cep.fetchDataFromServer(api);
}
//SITE DEVICE PAGE
export async function getAllDevicesData(){
    const api = cep.getApitoFetchAllDevicesData();
    return await cep.fetchDataFromServer(api);
}
//SITE DEVICE MAPPING
export async function getSiteToDeviceMapping(){
    const api =cep.getApiToFetchSiteDeviceMapping();
    return await cep.fetchDataFromServer(api);
}

export async function getSiteToConsumerMapping() {
    const api = cep.getApiToFetchSiteConsumerMapping();
    return await cep.fetchDataFromServer(api);
}

export async function updateSiteDataOnServer(data, id){
    const api = cep.getApiToUpdateSiteData(id);
    return await cep.fetchPut(api, data);
}


//Consumer

export async function getConsumerToDeviceMapping() {
    const api = cep.getApiToFetchConsumerDeviceMapping();
    return await cep.fetchDataFromServer(api);
}

//device profile update
/*export async function updateDevice(id,data) {
   const api= await cep.getApiToPutDevice(id);
   cep.fetchPut(api,data);
   console.log(id);
}
*/
//device profile update
export async function updateDevice(id, data) {
    const api = await cep.getApiToPutDevice(id);
    console.log('PUT request API:', api);
    cep.fetchPut(api, data);
    console.log('Device ID:', id);
 }
 
 export async function deleteSiteToDeviceMapping(id,data) {
    const api = cep.getApiToDeleteSiteDeviceMapping(id);
    const response = await cep.fetchDelete(api, data);
    return response;
 }
 

export async function registerSite(data,id) {
    const api = cep.getApiToRegisterSite(id);
    const response = await cep.fetchPost(api,data);
    return response;
}

export async function registerDevice(data,id) {
    const api = cep.getApiToRegisterDevice(id);
    const response = await cep.fetchPost(api,data);
        return response;
    
}
//site to sonsumer

export async function registerConsumer(id, data) {
    const api = cep.getApiToRegisterConsumer(id);
    return await cep.fetchPost(api, data);
}

export async function deregisterConsumer(id, data) {
    const api = cep.getApiToDeregisterConsumer(id);
    const res =  await cep.fetchDelete(api, data);
    console.log(res)
    return res;
}

export async function deregisterSite(id,data){
    const api= cep.getApiToDeregisterSite(id);
    const response = await cep.fetchDelete(api,data);
    console.log(response);

    return response;
}


//register consumer to device mapping
export async function registerConsumerDevice(data,id) {
    const api = cep.getApiToRegisterConsumerDeviceMapping(id);
    const response = await cep.fetchPost(api,data);
        return response;
    
}

//deregister consumer to device mapping
export async function deregisterConsumerDevice(id,data){
    const api= cep.getApiToDeregisterConsumerDeviceMapping(id);
    const response = await cep.fetchDelete(api,data);
    console.log(response);

    return response;
}


//assign device to user
export async function assignDeviceToUser(id,data){
    const api=cep.getApiToAssignDeviceToConsumer(id);
    const response= await cep.fetchPatch(api,data);
    
    return response;
}

//post device
export async function postDevice(id, data) {
    const api = await cep.getApiToPostDevice(id);
    console.log('POST request API:', api);
    cep.fetchPost(api, data);
    console.log('Device ID:', id);
 }

 export async function syncFirmwareData(){
    const api=cep.getApiToSyncFirmware();
    cep.fetchDataFromServer(api);
 }
 export async function syncSourceCode(){
    const api=cep.getApiToSyncSourceCode();
    cep.fetchDataFromServer(api);
 }

 export async function sendFirmwareToSites(){
    const api=cep.getApiToSendFirmwareToSites();
    cep.fetchDataFromServer(api);

 }

