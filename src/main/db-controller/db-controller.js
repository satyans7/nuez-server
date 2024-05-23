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
    jsonController.postUserDataToServer(user);
    
  }

  fetchUserById(userId){
    let data=jsonController.fetchAllUsers();
    // console.log(data);
    // console.log(userId);
    const user=data.find(user=> user._id === parseInt(userId));
    return user;
  }
}
module.exports = new DbController();
