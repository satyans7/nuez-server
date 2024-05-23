import * as cep from "./client-end-point.js";

export async function fetchAllDataFromServer() {
    const api = cep.getApiToFetchSampleDataFromServer();
    let res = await cep.getDataFromServer(api);
    console.log(res);

}

export async function postUserDataToServer(formData){
    const api = cep.getApiToRegisterUser();
    await cep.fetchPost(api,formData);
}
