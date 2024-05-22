import * as controller from "./controller.js";

const button = document.getElementById("fetch-data-from-server");

button.addEventListener("click", () => {
    controller.fetchAllDataFromServer();
})

