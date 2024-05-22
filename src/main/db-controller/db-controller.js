const jsonController = require("../json-controller/json-controller");

class DbController {
    fetchSampleDataFromServer() {
        let data = jsonController.fetchSampleData();
        console.log(data);
        return data;
    }
}
module.exports = new DbController();