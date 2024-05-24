import * as cep from "./client-end-point.js";

export async function fetchAllDataFromServer() {
    const api = cep.getApiToFetchSampleDataFromServer();
    let res = await cep.getDataFromServer(api);
    console.log(res);

}

export function postUserRegisterDataToServer(data){
    const api = cep.getApiToRegisterUser();
    cep.fetchPost(api,data);
}
export function postUserLoginDataToServer(data){
    const api = cep.getApiToAuthenticateUser();
    return cep.fetchPost(api,data);
}

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