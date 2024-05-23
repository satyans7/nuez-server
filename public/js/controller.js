import * as cep from "./client-end-point.js";

export async function fetchAllDataFromServer() {
    const api = cep.getApiToFetchSampleDataFromServer();
    let res = await cep.getDataFromServer(api);
    console.log(res);

}

export async function fetchAllUsersFromServer() {
    const api = cep.getApiToFetchSampleDataFromServer();
    let res = await cep.getAllUsersDataFromServer(api);
    //console.log(res);
    return res;
}

