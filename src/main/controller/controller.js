const dbController = require("../db-controller/db-controller");

class Controller {
  fetchSampleDataFromServer() {
    let data = dbController.fetchSampleDataFromServer();
    console.log(data);
    return data;
  }
  async registerUser(req, res) {
    const newUser=await dbController.postUserDataToServer(req.body);
    console.log(newUser);
    if(req.body.role==='admin'){
     await dbController.postUserRequestToServer(newUser);
    }
    
  }
  authenticateUser() {
    let data = dbController.fetchSampleDataFromServer();
    console.log(data);
    return data;
  }
  updateProfileOfUser() {
    let data = dbController.fetchSampleDataFromServer();
    console.log(data);
    return data;
  }
  fetchAllUsers() {
    let data = dbController.fetchAllUsers();
      // console.log(data);
      return data;
  }
  fetchRoleChangeReq() {
    let data = dbController.fetchRoleChangeReq();
      // console.log(data);
      return data;
  }
  fetchUserById(userId) {
    let data = dbController.fetchUserById(userId);
    // console.log(data);
    return data;
  }
  promoteUser() {
    let data = dbController.fetchSampleDataFromServer();
    console.log(data);
    return data;
  }
  demoteUser() {
    let data = dbController.fetchSampleDataFromServer();
    console.log(data);
    return data;
  }
  requestPromoteUser() {
    let data = dbController.fetchSampleDataFromServer();
    console.log(data);
    return data;
  }
  requestDemoteUser() {
    let data = dbController.fetchSampleDataFromServer();
    console.log(data);
    return data;
  }
}
module.exports = new Controller();
