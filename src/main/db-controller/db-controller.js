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

  async postUserRequestToServer(user, reqRole) {
    await jsonController.postUserRequestToServer(user, reqRole);
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
    const user = data.find(user => user._id === parseInt(userId));
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

  async findUserByEmail(email) {
    const users = await jsonController.fetchAllUsers();
    const user = users.find(user => user.email === email);
    return user;
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

  //////////////FOR TEST PURPOSE USE THIS/////////////
  async test(data){
    await jsonController.postUserDataToServer(data);
  }
}

module.exports = new DbController();
