const jsonController = require("../json-controller/json-controller");

class DbController {
  async fetchSampleDataFromServer() {
    let data = await jsonController.fetchSampleData();
    console.log(data);
    return data;
  }

  async isEmailReserved(email) {
    return await jsonController.isEmailReserved(email);
  }
  
  async postUserDataToServer(user) {
    const isReserved = await this.isEmailReserved(user.email);
    if (isReserved) {
      throw new Error('This email is reserved and cannot be registered.');
    }
    return await jsonController.postUserDataToServer(user);
  }

  async postUserRequestToServer(userId, reqRole) {
    await jsonController.postUserRequestToServer(userId, reqRole);
  }

  async fetchAllUsers() {
    let data = await jsonController.fetchAllUsers();
    return data;
  }

  async fetchRoleChangeReq() {
    let data = await jsonController.fetchRoleChangeReq();
    return data;
  }

  async fetchApprovedLog() {
    let data = await jsonController.fetchApprovedLog();
    return data;
  }

  async fetchRejectedLog() {
    let data = await jsonController.fetchRejectedLog();
    return data;
  }

  async fetchUserById(userId) {
    let data = await jsonController.fetchAllUsers();
    console.log(userId);
    const user = data[userId];
    return user;
  }

  async requestRoleChange(userId, reqRole) {
    await jsonController.postUserRequestToServer(userId, reqRole);
  }

  async deleteUserById(userId) {
    const data = await jsonController.deleteUserById(parseInt(userId));
    return data;
  }

  async isEmailReserved(email) {
    return await jsonController.isEmailReserved(email);
}

  

  async deleteReqByUserId(userId) {
    return await jsonController.deleteReqByUserId(userId);
  }

  async addResponseToLog(delUser, userData,timeStamp) {
    await jsonController.addResponseToLog(delUser, userData,timeStamp);
  }

  async roleChange(userId) {
    await jsonController.roleChange(userId);
  }
  /////added this////
  async findUserByEmail(email) {
    // console.log(typeof(email));
    const users = await this.fetchAllUsers()
    // console.log(users);
    for(let userId in  users ){
      // console.log(userId)
      if(users[userId].email===email){
        // console.log("matched")
        return users[userId]
      }
    }
    return {}
  }

  //////////////FOR TEST PURPOSE USE THIS/////////////
  async test(data){
    await jsonController.postUserDataToServer(data);
  }


// ADMIN_TO_SITE_MAPPING
  async  fetchAllAdminToSite() {
    let data = await jsonController.fetchAllAdminToSite();
    return data;
  }
}



module.exports = new DbController();
