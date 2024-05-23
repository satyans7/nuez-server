import * as controller from "./controller.js";
import * as register from "../pages/register.js";
const button = document.getElementById("fetch-data-from-server");

button.addEventListener("click", () => {
    controller.fetchAllDataFromServer();
})

export function postUserDataToServer(formData) {
    console.log("fetched")
    controller.postUserDataToServer(formData);
    
}





