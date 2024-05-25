const jsonController = require("../json-controller/json-controller");

class DbController {
  fetchSampleDataFromServer() {
    let data = jsonController.fetchSampleData();
    console.log(data);
    return data;
  }
  postUserDataToServer(user) {
    return jsonController.postUserDataToServer(user);
    
  }
  postUserRequestToServer(user,reqRole){
    jsonController.postUserRequestToServer(user,reqRole);
  }
  fetchAllUsers(){
    let data=jsonController.fetchAllUsers();
    // console.log(data);
    return(data);
  }
  fetchRoleChangeReq(){
    let data=jsonController.fetchRoleChangeReq();
    // console.log(data);
    return(data);
  }
  fetchApprovedLog(){
    let data=jsonController.fetchApprovedLog();
    // console.log(data);
    return(data);
  }
  fetchRejectedLog(){
    let data=jsonController.fetchRejectedLog();
    // console.log(data);
    return(data);
  }

  fetchUserById(userId){
    let data=jsonController.fetchAllUsers();
    // console.log(data);
    console.log(userId);
    const user=data.find(user=> user._id === parseInt(userId));
    return user;
  }

  requestRoleChange(user,reqRole){
    
    jsonController.postUserRequestToServer(user,reqRole);
  }

  deleteUserById(userId){
    const data=jsonController.deleteUserById(parseInt(userId))
    // console.log(data);
    return data;
  }


  findUserByEmail(email){
    const users = jsonController.fetchAllUsers();
    const user = users.find(user => user.email === email);
    return user;
  }

  deleteReqByUserId(userId){
    return jsonController.deleteReqByUserId(userId)
  }

  addResponseToLog(user,userData){
    jsonController.addResponseToLog(user,userData);

  }
  roleChange(userId){
    jsonController.roleChange(userId);
  }
}
module.exports = new DbController();

