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
