const jsonController = require("../json-controller/json-controller");

class DbController {
  fetchSampleDataFromServer() {
    let data = jsonController.fetchSampleData();
    console.log(data);
    return data;
  }
  postUserDataToServer(user, callback) {
    jsonController.postUserDataToServer(user,callback);
  }
}
module.exports = new DbController();
