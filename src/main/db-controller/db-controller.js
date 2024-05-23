const jsonController = require("../json-controller/json-controller");

class DbController {
  fetchSampleDataFromServer() {
    let data = jsonController.fetchSampleData();
    console.log(data);
    return data;
  }
  fetchAllUsers(){
    let data=jsonController.fetchAllUsers();
    console.log(data);
    return(data);
}
  postUserDataToServer(user) {
    let data =jsonController.postUserDataToServer(user);
    
  }
}
module.exports = new DbController();
