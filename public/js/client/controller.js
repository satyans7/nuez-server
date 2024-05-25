import * as cep from "./client-end-point.js";

export async function fetchAllDataFromServer() {
    const api = cep.getApiToFetchSampleDataFromServer();
    let res = await cep.getDataFromServer(api);
    console.log(res);

}

export function postUserRegisterDataToServer(data){
    const api = cep.getApiToRegisterUser();
    return cep.fetchPost(api,data);
}
export function postUserLoginDataToServer(data){
    const api = cep.getApiToAuthenticateUser();
    return cep.fetchPost(api,data);
}


//Super Admin

export async function fetchAllUsersFromServer() {
    const api = cep.getApiToFetchUserDetailsForAll();
    let res = await cep.getAllUsersDataFromServer(api);
    //console.log(res);
    return res;
}

export async function fetchPendingRequestsFromServer() {
    const api = cep.getApiToRoleChangeRequest();
    let res = await cep.getAllPendingRequestsFromServer(api);
    //console.log(res);
    return res;
}

export function postRequestToRoleChangeToServer(id, data) {
    const api = cep.getApiToRequestRoleChange(id);
    cep.fetchPost(api, data);
    //console.log(id)
}


export function postapproveRoleChange(id,data) {
    const api =cep.getApiToApproveRoleChange(id);
    cep.fetchPost(api,data);
    console.log(id);
}

export function postrejectRoleChange(id,data) {
    const api =cep.getApiToRejectRoleChange(id);
    cep.fetchPost(api,data);
    //console.log(id);
}