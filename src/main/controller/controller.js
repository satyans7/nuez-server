const dbController = require("../db-controller/db-controller");

class Controller {
    fetchSampleDataFromServer() {
      let data =  dbController.fetchSampleDataFromServer();
      console.log(data);
      return data;
    }

    registerUser() {
      let data =  dbController.fetchSampleDataFromServer();
      console.log(data);
      return data;
    }
    authenticateUser() {
      let data =  dbController.fetchSampleDataFromServer();
      console.log(data);
      return data;
    }
    updateProfileOfUser() {
      let data =  dbController.fetchSampleDataFromServer();
      console.log(data);
      return data;
    }
    fetchAllUsers() {
      let data =  dbController.fetchSampleDataFromServer();
      console.log(data);
      return data;
    }
    fetchUserById() {
      let data =  dbController.fetchSampleDataFromServer();
      console.log(data);
      return data;
    }
    promoteUser() {
      let data =  dbController.fetchSampleDataFromServer();
      console.log(data);
      return data;
    }
    demoteUser() {
      let data =  dbController.fetchSampleDataFromServer();
      console.log(data);
      return data;
    }
    requestPromoteUser() {
      let data =  dbController.fetchSampleDataFromServer();
      console.log(data);
      return data;
    }
    requestDemoteUser() {
      let data =  dbController.fetchSampleDataFromServer();
      console.log(data);
      return data;
    }

  }
module.exports = new Controller();

