const fs = require("fs");
const path = require("path");
const USER_DATA = path.join(__dirname, "../database/json-data/jsonData.json");
const REQ_DATA = path.join(__dirname, "../database/json-data/requestData.json");
const ACCEPTED_LOG = path.join(__dirname, "../database/json-data/approvedReqLog.json");
const REJECTED_LOG = path.join(__dirname, "../database/json-data/deniedReqLog.json");
const RESERVED_EMAILS = path.join(__dirname, "../database/reserved/reserved.json");
const ADMIN_TO_SITE_DATA = path.join(__dirname, "../database/json-data/adminToSites.json");
const SITE_DATA = path.join(__dirname, "../database/json-data/siteRegistration.json");
const SITE_TO_DEVICE_DATA = path.join(__dirname, "../database/json-data/siteToDevices.json")
const DEVICE_DATA = path.join(__dirname, "../database/json-data/deviceToProfile.json")
const CONSUMER_TO_DEVICE_DATA =path.join(__dirname, "../database/json-data/consumerToDevices.json");
const SITE_TO_CONSUMER_DATA= path.join(__dirname, "../database/json-data/siteToConsumer.json");
const OTPEMAIL = path.join(__dirname, "../database/json-data/otp-email.json");

class JsonController {
  fetchSampleData() {
    return { name: "Nuez Technologies" };
  }
  /////////// DO NOT CHANGE /////////////////////
  readDatabase(DATA_FILE) {
    try {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      throw new Error('Unable to read database: ' + error.message);
    }
  };

  writeDatabase(DATA_FILE, data) {
    try {
      const jsonData = JSON.stringify(data, null, 2);
      fs.writeFileSync(DATA_FILE, jsonData, 'utf8');
    } catch (error) {
      throw new Error('Unable to write to the database: ' + error.message);
    }
  };

  createNewUserId(lastUserId) {
    if (lastUserId == "-1") return "user_1";
    let numericPart = parseInt(lastUserId.split('_')[1]);
    numericPart++;
    let newUserId = `user_${numericPart}`;
    return newUserId;

  }
  /////////// DO NOT CHANGE /////////////////////

  postUserDataToServer = (user) => {
    try {
      const data = this.readDatabase(USER_DATA);
      const hasUser = Object.keys(data).length > 0;
      const usersIds = Object.keys(data);
      let lastUserId;
      if (hasUser) {
        lastUserId = usersIds[usersIds.length - 1];
      }
      else {
        lastUserId = "-1"
      }
      const newUserId = this.createNewUserId(lastUserId);
      const newUser = {
        ...user,
      };

      newUser.role = 'consumer';
      data[newUserId] = newUser;

      this.writeDatabase(USER_DATA, data);

      console.log(`${newUser.name} successfully registered`);
      return newUserId;
    } catch (error) {
      throw new Error('Failed to post user data: ' + error.message);
    }
  };
  postUserRequestToServer = async (userId, reqRole) => {
    try {
      const data = await this.readDatabase(REQ_DATA);
      const users = await this.readDatabase(USER_DATA);
      const currRole = users[userId].role;
      const userName = users[userId].name;
      // const reqRole=(user.role==="consumer")?"admin":"consumers"
      const newReq = {
        name: userName,
        // 'current-role': "consumer",
        // 'requested-role': "admin",
        // 'request-status': "pending"
        currentRole: currRole,
        requestedRole: reqRole,
        "requestStatus": "pending"
      };
      data[userId] = newReq;

      await this.writeDatabase(REQ_DATA, data);

      // return newUser;
      console.log(`${newReq.name} successfully added request`);
    } catch (error) {
      throw new Error('Failed to post user request: ' + error.message);
    }
  };
  ///// FETCH ALL USER DATA FROM THE DATABASE//////
  async fetchAllUsers() {
    const db = await this.readDatabase(USER_DATA);
    return db;
  }
  ////// FETCH ALL ROLE CHANGE REQUEST FROM THE DATABASE/////
  async fetchRoleChangeReq() {

    const db = await this.readDatabase(REQ_DATA);

    return db;
  }
  async fetchApprovedLog() {
    const db = await this.readDatabase(ACCEPTED_LOG);
    return db;
  }
  async fetchRejectedLog() {
    const db = await this.readDatabase(REJECTED_LOG);
    return db;
  }


  ////////  NOT USED CURRENTLY ////////
  //// TO DELETE A PARTICULAR USER BY ID FROM THE MAIN DATABASE/////
  async deleteUserById(userId) {
    const data = await this.readDatabase(USER_DATA);
    const userIndex = await data.users.findIndex(it => it._id === userId)
    const deletedUser = await data.users.splice(userIndex, 1)[0];
    await this.writeDatabase(USER_DATA, data);
    return deletedUser;

  }


  async deleteReqByUserId(userId) {
    const data = await this.readDatabase(REQ_DATA);
    console.log(data)
    const deletedUser = data[userId];
    delete data[userId];
    await this.writeDatabase(REQ_DATA, data);

    return deletedUser;
  }

  async addResponseToLog(delUser, userData, timeStamp) {
    const LOG_DB = (userData.action === "approved") ? ACCEPTED_LOG : REJECTED_LOG;
    try {
      const data = await this.readDatabase(LOG_DB);
      // const now=new Date();
      // console.log(now.toLocaleString());
      // const dateTime=now.toLocaleString();


      const newLog = {
        _id: userData._id,
        name: delUser.name,
        roleRequested: delUser.requestedRole,
        actionTaken: userData.action,
        timeStamp: timeStamp
      }
      data.push(newLog)
      await this.writeDatabase(LOG_DB, data);

      // return newUser;
      console.log(`${newLog.name} successfully added request`);
    } catch (error) {
      throw new Error('Failed to post user request: ' + error.message);
    }
  }

  async roleChange(userId) {
    const data = await this.readDatabase(USER_DATA);
    if (data[userId].role === "consumer") {
      data[userId].role = "admin"
    }
    else {
      data[userId].role = "consumer"
    }

    await this.writeDatabase(USER_DATA, data);
  }

  async isEmailReserved(email) {
    try {
      const reservedData = this.readDatabase(RESERVED_EMAILS);
      const reservedEmails = reservedData.reserved_emails;
      return reservedEmails.includes(email);
    } catch (error) {
      throw new Error('Failed to check if email is reserved: ' + error.message);
    }
  }

  async saveotpemail(otp,email){
    const data = {}
      data[email]=otp;
    
    await this.writeDatabase(OTPEMAIL,data);
    console.log(`${email} otp has been saved successfully`)
    return email;
  }
  async updateotpemail(otp,email){
    const data =await this.readDatabase(OTPEMAIL);
     data[email]=otp;
    await this.writeDatabase(OTPEMAIL,data);
    console.log(`${email} otp has been updated successfully`)
    return email;
  }
  
  async isOTPRequested(email){
    const data = await this.readDatabase(OTPEMAIL);
    if(data[email])return 1;
    return 0;
  }

  async findOTPByEmail(email){
    const data =await this.readDatabase(OTPEMAIL);
    return await data[email];
  }
   
  async deleteOTPByEmail(email){
    const data =await this.readDatabase(OTPEMAIL);
    delete data[email];
    await this.writeDatabase(OTPEMAIL,data);
  }



  // GET ADMIN_TO_SITE_MAPPING
  async fetchAllAdminToSite() {
    const db = await this.readDatabase(ADMIN_TO_SITE_DATA);
    return db;
  }

  //Fetch all sites
  async fetchAllSites() {
    const db = await this.readDatabase(SITE_DATA);
    return db;
  }


  // site to device mapping

  async fetchAllSitetoDevice() {
    const db = await this.readDatabase(SITE_TO_DEVICE_DATA);
    return db;
  }


  // fetch all devices

  async fetchAllDevices() {
    const db = await this.readDatabase(DEVICE_DATA);
    return db;
  }

  //fetch consumer to device mapping
  async fetchConsumerToDevice(){
    const db =await this.readDatabase(CONSUMER_TO_DEVICE_DATA);
    return db;
  }

  //fetch site to consumer mapping
  async fetchSiteToConsumer(){
    const db =await this.readDatabase(SITE_TO_CONSUMER_DATA);
    return db;
  }

 

async putSite(req,res){
  const siteId = req.params.id;
const { name, location } = req.body;

  try {
    let sites = await this.readDatabase(SITE_DATA);

    if (!sites[siteId]) {
        return res.status(404).send({ error: 'Site not found' });
    }
        sites[siteId].name = name;
        sites[siteId].location = location;

    await this.writeDatabase(SITE_DATA,sites);

    res.send({ message: 'Site updated successfully', site: sites[siteId] });
} catch (error) {
    res.status(500).send({ error: 'An error occurred while updating the site' });
}

}


async putDevice(req,res){
  const deviceId = req.params.id;
const { name,location,totalConsumption,status,registrationDate } = req.body;

  try {
    let devices = await this.readDatabase(DEVICE_DATA);

    if (!devices[deviceId]) {
        return res.status(404).send({ error: 'Site not found' });
    }
        devices[deviceId].name = name;
        devices[deviceId].location = location;
        devices[deviceId].totalConsumption = totalConsumption;
        devices[deviceId].status = status;
        devices[deviceId].registrationDate=registrationDate;
    await this.writeDatabase(DEVICE_DATA,devices);

    res.send({ message: 'Site updated successfully', device: devices[deviceId] });
} catch (error) {
    res.status(500).send({ error: 'An error occurred while updating the site' });
}

}


  async registerSite(req, res) {
    const user = req.params.id;
    const site = req.body.site;


    try {
      let data = await this.readDatabase(ADMIN_TO_SITE_DATA);

      if (Object.values(data).find(sites => sites.find(s => s === site))) {
        return res.status(400).json({ message: "Site already registered under another admin" });
      }

      else if (data[user]) {
        if (!data[user].find(s => s === site)) {
          data[user].push(site);
          await this.writeDatabase(ADMIN_TO_SITE_DATA, data);
          return res.status(200).json({ message: "Site registered successfully", data });
        } else {
          return res.status(400).json({ message: "Site already exists" });
        }
      } else {
        return res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async deregisterSite(req, res) {
    const user = req.params.id;
    const site = req.body.site;
    let data = await this.readDatabase(ADMIN_TO_SITE_DATA);
    try {
      if (data[user]) {
        const siteIndex = data[user].findIndex(s => s === site);
        if (siteIndex > -1) {
          data[user].splice(siteIndex, 1);
          await this.writeDatabase(ADMIN_TO_SITE_DATA, data);
          return res.status(200).json({ message: "Site deleted successfully", data });
        } else {
          return res.status(400).json({ message: "Site not found for this user" });
        }
      } else {
        return res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async registerConsumer(req, res) {
    const site = req.params.id;
    const consumer = req.body.consumer;


    try {
      let data = await this.readDatabase(SITE_TO_CONSUMER_DATA);

      if (Object.values(data).find(consumers => consumers.find(c => c === consumer))) {
        return res.status(400).json({ message: "Consumer already registered under another site" });
      }

      else if (data[site]) {
        if (!data[site].find(c => c === consumer)) {
          data[site].push(consumer);
          await this.writeDatabase(SITE_TO_CONSUMER_DATA, data);
          return res.status(200).json({ message: "Consumer registered successfully", data });
        } else {
          return res.status(400).json({ message: "Consumer already exists" });
        }
      } else {
        return res.status(404).json({ message: "Site does  not exists" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async deregisterConsumer(req, res) {
    const site = req.params.id;
    const consumer = req.body.consumer;
    let data = await this.readDatabase(SITE_TO_CONSUMER_DATA);
    try {
      if (data[site]) {
        const consumerIndex = data[site].findIndex(c => c === consumer);
        if (consumerIndex > -1) {
          data[site].splice(consumerIndex, 1);
          await this.writeDatabase(SITE_TO_CONSUMER_DATA, data);
          return res.status(200).json({ message: "Consumer deleted successfully", data });
        } else {
          return res.status(400).json({ message: "Consumer not found for this site" });
        }
      } else {
        return res.status(404).json({ message: "Site does  not exists" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }


}
module.exports = new JsonController();
