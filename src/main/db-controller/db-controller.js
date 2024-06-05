const jsonController = require("../json-controller/json-controller");

class DbController {
  async fetchSampleDataFromServer() {
    let data = await jsonController.fetchSampleData();
    console.log(data);
    return data;
  }

  async saveotpemail(otp, email) {
    return await jsonController.saveotpemail(email, otp);
  }

  async updateotpemail(otp, email) {
    return await jsonController.updateotpemail(email, otp);
  }

  async deleteOTPByEmail(email) {
    return await jsonController.deleteOTPByEmail(email);
  }

  async isOTPRequested(email) {
    return await jsonController.isOTPRequested(email);
  }
  async findOTPByEmail(email) {
    return await jsonController.findOTPByEmail(email);
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

  async addResponseToLog(delUser, userData, timeStamp) {
    await jsonController.addResponseToLog(delUser, userData, timeStamp);
  }

  async roleChange(userId) {
    await jsonController.roleChange(userId);
  }
  /////added this////
  async findUserByEmail(email) {
    // console.log(typeof(email));
    const users = await this.fetchAllUsers()
    // console.log(users);
    for (let userId in users) {
      // console.log(userId)
      if (users[userId].email === email) {
        // console.log("matched")
        let newobj = users[userId];
        // let newobj={
        //   _id:userId,
        //   ...newo
        // }
        newobj["_id"] = userId;
        console.log(newobj);
        return newobj;
      }
    }
    return {}
  }

  //////////////FOR TEST PURPOSE USE THIS/////////////
  async test(data) {
    await jsonController.postUserDataToServer(data);
  }


  // ADMIN_TO_SITE_MAPPING
  async fetchAllAdminToSite() {
    let data = await jsonController.fetchAllAdminToSite();
    return data;
  }

  //fetch all sites
  async fetchAllSites() {
    let data = await jsonController.fetchAllSites();
    return data;
  }

  // Site to device mapping

  async fetchAllSitetoDevice() {
    let data = await jsonController.fetchAllSitetoDevice();
    return data;
  }

  //fetch all devices
  async fetchAllDevices() {
    let data = await jsonController.fetchAllDevices();
    return data;
  }
  //consumer to device mapping
  async fetchAllConsumertoDevice() {
    let data = await jsonController.fetchConsumerToDevice();
    return data;
  }

  //site to consumer mapping
  async fetchAllSiteToConsumer() {
    let data = await jsonController.fetchSiteToConsumer();
    return data;
  }




  async putSite(req, res) {
    await jsonController.putSite(req, res);
  }


  async putDevice(req, res) {
    await jsonController.putDevice(req, res);
  }

  async registerSite(req, res) {
    await jsonController.registerSite(req, res);
  }

  async deregisterSite(req, res) {
    await jsonController.deregisterSite(req, res);

  }
  async registerDevice(req, res) {
    await jsonController.registerDevice(req, res);
  }

  async deregisterDevice(req, res) {
    await jsonController.deregisterDevice(req, res);

  }

  async registerConsumer(req, res) {
    await jsonController.registerConsumer(req, res);
  }

  async deregisterConsumer(req, res) {
    await jsonController.deregisterConsumer(req, res);

  }
}




module.exports = new DbController();
