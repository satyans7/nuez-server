const dbController = require("../db-controller/db-controller");

class DbController {
    fetchAllDataFromServer() {
      let data =  dbController.fetchAllDataFromJsonDb();
      console.log(data);
      return data;
    }
}
module.exports = new DbController();

