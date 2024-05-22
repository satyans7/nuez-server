const jsonController = require("../json-controller/json-controller");

class DbController {
    fetchAllDataFromJsonDb() {
        let data = jsonController.fetchAllData();
        console.log(data);
        return data;
    }
}
module.exports = new DbController();