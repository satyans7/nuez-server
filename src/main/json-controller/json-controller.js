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


      const newLog = {
        name: delUser.name,
        roleRequested: delUser.requestedRole,
        actionTaken: userData.action,
        timeStamp: timeStamp
      }
      data[userData._id]=newLog;
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
  const userId = req.params.id;
  const newSite = req.body.site;

  try {
    let data = await this.readDatabase(ADMIN_TO_SITE_DATA);

    // Initialize the database if it is empty
    if (!data) {
      data = {};
    }

    // Check if the site is already registered under another admin
    const isSiteRegisteredElsewhere = Object.values(data).some(sites => sites.includes(newSite));
    if (isSiteRegisteredElsewhere) {
      return res.status(400).json({ message: "Site already registered under another admin" });
    }

    // If the user exists in the data
    if (data[userId]) {
      // Check if the site is already registered under the same user
      const isSiteAlreadyRegistered = data[userId].includes(newSite);
      if (isSiteAlreadyRegistered) {
        return res.status(400).json({ message: "Site already exists" });
      } else {
        // Add the new site to the user's list of sites
        data[userId].push(newSite);
        await this.writeDatabase(ADMIN_TO_SITE_DATA, data);
        return res.status(200).json({ message: "Site registered successfully", data });
      }
    } else {
      // If the user does not exist, create a new entry for the user with the new site
      data[userId] = [newSite];
      await this.writeDatabase(ADMIN_TO_SITE_DATA, data);
      return res.status(200).json({ message: "User created and site registered successfully", data });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}


  // Function to deregister a site from a user
async deregisterSite(req, res) {
  const userId = req.params.id;
  const siteToRemove = req.body.site;

  try {
    let data = await this.readDatabase(ADMIN_TO_SITE_DATA);

    // Initialize data if it is empty
    if (!data) {
      data = {};
    }

    if (data[userId]) {
      const siteIndex = data[userId].indexOf(siteToRemove);
      if (siteIndex > -1) {
        data[userId].splice(siteIndex, 1);
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

// Function to register a consumer to a site
async registerConsumer(req, res) {
  const siteId = req.params.id;
  const newConsumer = req.body.consumer;

  try {
    let data = await this.readDatabase(SITE_TO_CONSUMER_DATA);

    // Initialize data if it is empty
    if (!data) {
      data = {};
    }

    // Check if the consumer is already registered under another site
    const isConsumerRegisteredElsewhere = Object.values(data).some(consumers => consumers.includes(newConsumer));
    if (isConsumerRegisteredElsewhere) {
      return res.status(400).json({ message: "Consumer already registered under another site" });
    }

    if (data[siteId]) {
      // Check if the consumer is already registered under the same site
      const isConsumerAlreadyRegistered = data[siteId].includes(newConsumer);
      if (isConsumerAlreadyRegistered) {
        return res.status(400).json({ message: "Consumer already exists" });
      } else {
        // Add the new consumer to the site's list of consumers
        data[siteId].push(newConsumer);
        await this.writeDatabase(SITE_TO_CONSUMER_DATA, data);
        return res.status(200).json({ message: "Consumer registered successfully", data });
      }
    } else {
      return res.status(404).json({ message: "Site does not exist" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Function to deregister a consumer from a site
async deregisterConsumer(req, res) {
  const siteId = req.params.id;
  const consumerToRemove = req.body.consumer;

  try {
    let data = await this.readDatabase(SITE_TO_CONSUMER_DATA);

    // Initialize data if it is empty
    if (!data) {
      data = {};
    }

    if (data[siteId]) {
      const consumerIndex = data[siteId].indexOf(consumerToRemove);
      if (consumerIndex > -1) {
        data[siteId].splice(consumerIndex, 1);
        await this.writeDatabase(SITE_TO_CONSUMER_DATA, data);
        return res.status(200).json({ message: "Consumer deleted successfully", data });
      } else {
        return res.status(400).json({ message: "Consumer not found for this site" });
      }
    } else {
      return res.status(404).json({ message: "Site does not exist" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}


}
module.exports = new JsonController();
