import * as cep from "./client-end-point.js";

export async function fetchAllDataFromServer() {
    const api = cep.getApiToFetchAllDataFromServer();
    let res = await cep.getDataFromServer(api);
    console.log(res);

}
