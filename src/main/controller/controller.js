const dbController = require("../db-controller/db-controller");
const { passwordAuthController, otpAuthController, googleAuthController } = require("../auth-controller/auth-controller");
const otpGeneratorUtility = require("../utils/otp-generator")
const { roleAuthenticatorIdSensitive, roleAuthenticatorIdInSensitive, isAuthenticated } = require("../middlewares/auth")
const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');
const { createCanvas } = require('canvas');


const { handleCloudMqttPublish } = require("../mqtt/helper");
const { deviceStatus, sitesBinFileNamesInMemory } = require("../telegramAlarm/map");
const TOPIC_FOR_PI_SOURCE_CODE_SYNC = `pi-source-code-sync`;
const QRdirectoryPathForDevices = path.join(__dirname, '../qr_codes_generated/qr_codes_generated_devices');
const QRdirectoryPathForSites = path.join(__dirname, '../qr_codes_generated/qr_codes_generated_sites');

const USER_DATA = path.join(__dirname, "../database/json-data/jsonData.json");
const REQ_DATA = path.join(__dirname, "../database/json-data/requestData.json");
const ACCEPTED_LOG = path.join(__dirname, "../database/json-data/approvedReqLog.json");
const REJECTED_LOG = path.join(__dirname, "../database/json-data/deniedReqLog.json");
const ADMIN_TO_SITE_DATA = path.join(__dirname, "../database/json-data/adminToSites.json");
const SITE_DATA = path.join(__dirname, "../database/json-data/siteRegistration.json");
const SITE_TO_DEVICE_DATA = path.join(__dirname, "../database/json-data/siteToDevices.json");
const DEVICE_DATA = path.join(__dirname, "../database/json-data/deviceToProfile.json");
const CONSUMER_TO_DEVICE_DATA = path.join(__dirname, "../database/json-data/consumerToDevices.json");
const SITE_TO_CONSUMER_DATA = path.join(__dirname, "../database/json-data/siteToConsumer.json");
const OTPEMAIL = path.join(__dirname, "../database/json-data/otp-email.json");




class Controller {
  passport = googleAuthController;


  ///////////////////////////////REGISTER A USER///////////////////////////////////

  async fetchAllUsers() {
    const db = await dbController.readDatabase(USER_DATA);
    return db;
  }



  ////////////////////////UNIQUENESS OF EMAIL/USERNAME////////////////////////////////////
  async validateUniquenessOfUserName(username) {
    const user = await passwordAuthController.findUserByEmail(username);
    // console.log(user);
    const size = Object.keys(user).length
    if (size) {
      return true;
    }
    else {
      return false;
    }
  }

  createNewUserId(lastUserId) {
    if (lastUserId == "-1") return "user_1";
    let numericPart = parseInt(lastUserId.split('_')[1]);
    numericPart++;
    let newUserId = `user_${numericPart}`;
    return newUserId;

  }

  async postUserDataToServer(user) {
    const isReserved = await passwordAuthController.isEmailReserved(user.email);
    if (isReserved) {
      throw new Error('This email is reserved and cannot be registered.');
    }

    try {
      const data = dbController.readDatabase(USER_DATA);
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

      dbController.writeDatabase(USER_DATA, data);

      console.log(`${newUser.name} successfully registered`);
      return newUserId;
    } catch (error) {
      throw new Error('Failed to post user data: ' + error.message);
    }
  }

  async postUserRequestToServer(userId, reqRole) {
    try {
      const data = await dbController.readDatabase(REQ_DATA);
      const users = await dbController.readDatabase(USER_DATA);
      const currRole = users[userId].role;
      const userName = users[userId].name;
      const newReq = {
        name: userName,
        currentRole: currRole,
        requestedRole: reqRole,
        "requestStatus": "pending"
      };
      data[userId] = newReq;

      dbController.writeDatabase(REQ_DATA, data);
      console.log(`${newReq.name} successfully added request`);
    } catch (error) {
      throw new Error('Failed to post user request: ' + error.message);
    }
  }

  async registerUser(req, res) {
    try {
      const email = req.body.email;

      // Check if email is reserved
      const isReserved = await passwordAuthController.isEmailReserved(email);

      if (isReserved) {

        return res.status(400).json({ success: false, message: 'Username already exists' });
      }

      // Validate email uniqueness
      const isUnique = await this.validateUniquenessOfUserName(email);

      if (isUnique) {

        return res.status(400).json({ success: false, message: 'Username already exists' });
      } else {
        // Register the new user
        const newUserId = await this.postUserDataToServer(req.body);

        // Additional handling for admin role
        console.log(req.body.role);
        if (req.body.role === 'admin') {
          await this.postUserRequestToServer(newUserId, req.body.role);
        }

        return res.status(201).json({ success: true, message: 'Successfully registered' });
      }
    } catch (error) {
      console.error('Error in registerUser:', error.message);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  /////////////////////AUTHENTICATE USER/////////////////////////
  async authenticateUser(req, res, formData) {
    try {
      let authResult = await passwordAuthController.authenticateUser(formData);
      if (authResult.success) {
        if (authResult.route) {
          // Handle special case for reserved emails
          let user = {
            user_id: "idSA",
            name: "nameSA",
            email: formData.email,
            role: "superAdmin"
          }
          req.login(user, (err) => {
            if (err) {
              return next(err);
            }

            return res.status(200).send({ success: true, route: authResult.route, message: 'Logged in successfully!!' });
          });
        }

        else {
          let user = {
            user_id: authResult.user._id,
            name: authResult.user.name,
            email: authResult.user.email,
            role: authResult.user.role
          }
          let route = `/api/${authResult.role}-dashboard/${user.user_id}`;
          req.login(user, (err) => {
            if (err) {
              return next(err);
            }
            return res.status(200).send({ success: true, route: route, message: 'Logged in successfully!!' });
          });
        }
      }
      else {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
    } catch (error) {
      return res.status(500).json({ success: false, route: 'null', message: 'Internal Server Error' });
    }
  }


  ///////////////////////////////////////UNUSED/////////////////////////////////////////////////////
  async updateProfileOfUser() {
    let data = await dbController.fetchSampleDataFromServer();
    console.log(data);
    return data;
  }

  async deleteUserById(userId) {
    const data = await dbController.readDatabase(USER_DATA);
    const userIndex = await data.users.findIndex(it => it._id === userId)
    const deletedUser = await data.users.splice(userIndex, 1)[0];
    dbController.writeDatabase(USER_DATA, data);
    return deletedUser;
  }


  //////////////////////////SEND A REQ FOR ROLE CHANGE///////////////////////////////////////////////
  async requestRoleChange(req) {
    let userId = req.body._id;
    const reqRole = req.body.reqRole;
    await this.postUserRequestToServer(userId, reqRole);
  }

  ////////////////////////////DELETE THE REQ AND ADD TO LOG////////////////////////////////////////

  async deleteReqByUserId(userId) {
    const data = await dbController.readDatabase(REQ_DATA);
    console.log(data)
    const deletedUser = data[userId];
    delete data[userId];
    dbController.writeDatabase(REQ_DATA, data);
    return deletedUser;
  }

  async addResponseToLog(delUser, userData, timeStamp) {
    const LOG_DB = (userData.action === "approved") ? ACCEPTED_LOG : REJECTED_LOG;
    try {
      const data = await dbController.readDatabase(LOG_DB);
      const newLog = {
        name: delUser.name,
        roleRequested: delUser.requestedRole,
        actionTaken: userData.action,
        timeStamp: timeStamp
      }
      data[userData._id] = newLog;
      await dbController.writeDatabase(LOG_DB, data);
      console.log(`${newLog.name} successfully added request`);
    } catch (error) {
      throw new Error('Failed to post user request: ' + error.message);
    }
  }

  async roleChange(userId) {
    const data = await dbController.readDatabase(USER_DATA);
    if (data[userId].role === "consumer") {
      data[userId].role = "admin"
    }
    else {
      data[userId].role = "consumer"
    }

    await dbController.writeDatabase(USER_DATA, data);
  }

  async roleChangeResponse(req) {
    const action = req.body.action;
    const userId = req.body._id;
    const delUser = await this.deleteReqByUserId(userId);
    const timeStamp = await this.getTimeAndDate();
    await this.addResponseToLog(delUser, req.body, timeStamp);
    if (action === "approved") {
      await this.roleChange(userId);
    }
  }

  /////////////////////////FUNCTION FOR DATE AND TIME///////////////////////////
  async getTimeAndDate() {
    // try {
    //   const ntpTime = await new Promise((resolve, reject) => {
    //     ntpClient.getNetworkTime('pool.ntp.org', 123, (err, date) => {
    //       if (err) {
    //         reject(err);
    //       } else {
    //         resolve(date);
    //       }
    //     });
    //   });
    //   console.log('Received NTP Date:', ntpTime);
    //   return await ntpTime.toLocaleString();
    // } catch (error) {
    //   console.error('Error fetching time from NTP:', error);
    const localTime = new Date();
    console.log('Using local time:', localTime);
    return localTime.toLocaleString();

  }

  ////////////////////////////FETCH ALL ADMIN INFO/////////////////////////////////
  async fetchAllAdminInfo() {
    let data = await this.fetchAllUsers();

    const newObject = {};
    let ids = Object.keys(data);
    ids.forEach(id => {
      const user = data[id];
      if (user.role === 'admin') {
        newObject[id] = {
          name: user.name,
          email: user.email,
          role: user.role
        };
      }
    });
    return newObject;
  }

  //////////////////////////////FETCH ALL CONSUMER INFO/////////////////////////////
  async fetchAllConsumerInfo() {
    let data = await this.fetchAllUsers();

    const newObject = {};
    let ids = Object.keys(data);
    ids.forEach(id => {
      const user = data[id];
      if (user.role === 'consumer') {
        newObject[id] = {
          name: user.name,
          email: user.email,
          role: user.role
        };
      }
    });
    return newObject;
  }

  //////////////////////////FETCH ALL ROLE CHANGE REQ///////////////////////////////
  async fetchRoleChangeReq() {
    let data = await dbController.readDatabase(REQ_DATA);;
    const newObject = {};
    let ids = Object.keys(data);
    ids.forEach(id => {
      const user = data[id];
      newObject[id] = {
        name: user.name,
        currentRole: user.currentRole,
        requestedRole: user.requestedRole,
        requestStatus: user.requestStatus

      };
    });
    return newObject;
  }

  /////////////////////////FETCH THE APPROVED LOG/////////////////////////
  async fetchApprovedLog() {
    let data = await dbController.readDatabase(ACCEPTED_LOG);
    return data;
  }
  ////////////////////////FETCH THE DENIED LOG//////////////////////////////
  async fetchRejectedLog() {
    let data = await dbController.readDatabase(REJECTED_LOG);
    return data;
  }
  ///////////////////////FETCH A SINGLE USER BY ID//////////////////////////
  async fetchUserById(userId) {
    let data = await this.fetchAllUsers();
    console.log(userId);
    const user = data[userId];
    return user;
  }


  async saveotpemail(email, otp) {
    const data = {}
    data[email] = otp;

    await dbController.writeDatabase(OTPEMAIL, data);
    console.log(`${email} otp has been saved successfully`)
    return email;
  }

  async updateotpemail(otp, email) {
    const data = await dbController.readDatabase(OTPEMAIL);
    data[email] = otp;
    await dbController.writeDatabase(OTPEMAIL, data);
    console.log(`${email} otp has been updated successfully`)
    return email;
  }

  async isOTPRequested(email) {
    const data = await dbController.readDatabase(OTPEMAIL);
    if (data[email]) return 1;
    return 0;
  }


  async deleteOTPByEmail(email) {
    const data = await dbController.readDatabase(OTPEMAIL);
    delete data[email];
    await dbController.writeDatabase(OTPEMAIL, data);
  }

  async OTPGenerationAndStorage(email) {
    const otp = otpGeneratorUtility.generateOTP();
    await otpAuthController.sendVerificationEmail(email, otp);
    const OTPAlreadyRequested = await this.isOTPRequested(email);
    if (OTPAlreadyRequested) {
      return await this.updateotpemail(email, otp);
    }
    else return await this.saveotpemail(email, otp);
  }

  async OTPVerification(req, res, email, providedotp) {
    const authResult = await otpAuthController.verifyOTP(email, providedotp);
    console.log(authResult)
    if (authResult.success) {
      await this.deleteOTPByEmail(email);
      let user = {
        user_id: authResult.user._id,
        name: authResult.user.name,
        email: authResult.user.email,
        role: authResult.user.role
      }
      let route = `/`;
      req.login(user, (err) => {
        if (err) {
          return next(err);
        }
        return res.status(200).send({ success: true, route: route, message: 'Logged in successfully!!' });
      });
    }
    else {
      return res.status(401).send({ success: false, route: 'null', message: 'Invalid OTP!!!' });
    }
  }

  //ADMIN_TO_SITE_MAPPING
  async fetchAllAdminToSite() {
    let data = await dbController.readDatabase(ADMIN_TO_SITE_DATA);
    return data;
  }

  //Fetch all sites
  async fetchAllSites() {
    let data = await dbController.readDatabase(SITE_DATA);
    return data;
  }

  async fetchAllSitesUnderAdmin(id) {
    const admintosite = await this.fetchAllAdminToSite();
    const allSites = await this.fetchAllSites();
    const sites = admintosite[id];

    const data = Object.fromEntries(
      Object.entries(allSites).filter(([key]) => sites.includes(key))
    );
    return data;
  }

  // Site to device mapping

  async fetchAllSitetoDevice() {
    const db = await dbController.readDatabase(SITE_TO_DEVICE_DATA);
    return db;
  }

  // fetch all devices

  async fetchAllDevices() {
    let data = await dbController.readDatabase(DEVICE_DATA);
    return data;
  }

  async fetchDeviceData(device_id) {
    let data = await this.fetchAllDevices();
    return data[device_id];
  }

  async fetchSiteData(site_id) {
    let data = await this.fetchAllSites();
    return data[site_id];
  }

  async fetchAllDevicesUnderSite(id) {
    const sitetodevice = await this.fetchAllSitetoDevice();
    const allDevices = await this.fetchAllDevices();
    const devices = sitetodevice[id];

    const data = Object.fromEntries(
      Object.entries(allDevices).filter(([key]) => devices.includes(key))
    );

    return data;
  }

  async fetchAllSiteToConsumer() {
    const db = await dbController.readDatabase(SITE_TO_CONSUMER_DATA);
    return db;
  }

  async fetchAllConsumersUnderSite(id) {
    const sitetoconsumer = await this.fetchAllSiteToConsumer();
    const allconsumers = await this.fetchAllUsers();
    const consumers = sitetoconsumer[id];

    const data = Object.fromEntries(
      Object.entries(allconsumers).filter(([key]) => consumers.includes(key))
    );
    return data;
  }

  //fetch all consumer to device
  async fetchAllConsumertoDevice() {
    const db = await dbController.readDatabase(CONSUMER_TO_DEVICE_DATA);
    return db;
  }


  async putSite(req, res) {
    const siteId = req.params.id;
    const { name, location } = req.body;

    try {
      let sites = await dbController.readDatabase(SITE_DATA);

      if (!sites[siteId]) {
        return res.status(404).send({ error: 'Site not found' });
      }
      sites[siteId].name = name;
      sites[siteId].location = location;

      dbController.writeDatabase(SITE_DATA, sites);

      res.send({ message: 'Site updated successfully', site: sites[siteId] });
    } catch (error) {
      res.status(500).send({ error: 'An error occurred while updating the site' });
    }
  }


  async putDevice(req, res) {
    const deviceId = req.params.id;
    const { name, location, totalConsumption, status, registrationDate } = req.body;

    try {
      let devices = await dbController.readDatabase(DEVICE_DATA);

      if (!devices[deviceId]) {
        return res.status(404).send({ error: 'Site not found' });
      }
      devices[deviceId].name = name;
      devices[deviceId].location = location;
      devices[deviceId].totalConsumption = totalConsumption;
      devices[deviceId].status = status;
      devices[deviceId].registrationDate = registrationDate;
      await dbController.writeDatabase(DEVICE_DATA, devices);

      res.send({ message: 'Site updated successfully', device: devices[deviceId] });
    } catch (error) {
      res.status(500).send({ error: 'An error occurred while updating the site' });
    }
  }

  async registerSite(req, res) {
    const userId = req.params.id;
    const newSite = req.body.site;

    try {
      let data = await dbController.readDatabase(ADMIN_TO_SITE_DATA);
      let sites = await dbController.readDatabase(SITE_DATA);

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
          sites[newSite].admin = userId;
         dbController.writeDatabase(ADMIN_TO_SITE_DATA, data);
         dbController.writeDatabase(SITE_DATA, sites);
          return res.status(200).json({ message: "Site registered successfully", data });
        }
      } else {
        // If the user does not exist, create a new entry for the user with the new site
        data[userId] = [newSite];
        await dbController.writeDatabase(ADMIN_TO_SITE_DATA, data);
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
      let data = await dbController.readDatabase(ADMIN_TO_SITE_DATA);
      let sites = await dbController.readDatabase(SITE_DATA);

      // Initialize data if it is empty
      if (!data) {
        data = {};
      }

      if (data[userId]) {
        const siteIndex = data[userId].indexOf(siteToRemove);
        if (siteIndex > -1) {
          data[userId].splice(siteIndex, 1);
          sites[siteToRemove].admin = "not assigned";
          dbController.writeDatabase(ADMIN_TO_SITE_DATA, data);
          dbController.writeDatabase(SITE_DATA, sites);
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


  async registerConsumerToDeviceMapping(req, res) {
    const consumer = req.params.id;
    const device = req.body.device;


    try {
      let data = await dbController.readDatabase(CONSUMER_TO_DEVICE_DATA);
      let deviceProfile = await dbController.readDatabase(DEVICE_DATA);


      if (Object.values(data).find(devices => devices.find(d => d === device))) {
        return res.status(400).json({ message: "Device already registered under another site" });
      }

      else if (data[consumer]) {
        if (!data[consumer].find(d => d === device)) {
          data[consumer].push(device);
          await dbController.writeDatabase(CONSUMER_TO_DEVICE_DATA, data);
          deviceProfile[device].owner = consumer;
          await dbController.writeDatabase(DEVICE_DATA, deviceProfile);
          return res.status(200).json({ message: "Device registered successfully", data });
        } else {
          return res.status(400).json({ message: "Device already exists" });
        }
      } else {
        return res.status(404).json({ message: "Site not found" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }


  async deregisterConsumerToDeviceMapping(req, res) {
    const consumer = req.params.id;
    const device = req.body.device;
    let data = await dbController.readDatabase(CONSUMER_TO_DEVICE_DATA);
    let deviceProfile = await dbController.readDatabase(DEVICE_DATA);
    try {
      if (data[consumer]) {
        const deviceIndex = data[consumer].findIndex(d => d === device);
        if (deviceIndex > -1) {
          data[consumer].splice(deviceIndex, 1);
          await dbController.writeDatabase(CONSUMER_TO_DEVICE_DATA, data);
          deviceProfile[device].owner = "not assigned";
          await dbController.writeDatabase(DEVICE_DATA, deviceProfile);
          return res.status(200).json({ message: "Device deleted successfully", data });
        } else {
          return res.status(400).json({ message: "Device not found for this site" });
        }
      } else {
        return res.status(404).json({ message: "Site not found" });
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
      let data = await dbController.readDatabase(SITE_TO_CONSUMER_DATA);

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
          await dbController.writeDatabase(SITE_TO_CONSUMER_DATA, data);
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
      let data = await dbController.readDatabase(SITE_TO_CONSUMER_DATA);

      // Initialize data if it is empty
      if (!data) {
        data = {};
      }

      if (data[siteId]) {
        const consumerIndex = data[siteId].indexOf(consumerToRemove);
        if (consumerIndex > -1) {
          data[siteId].splice(consumerIndex, 1);
          await dbController.writeDatabase(SITE_TO_CONSUMER_DATA, data);
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

  async AssignDevicetoConsumer(req, res) {
    const userId = req.params.id;
    const deviceId = req.body.device;

    try {
      let data = await dbController.readDatabase(CONSUMER_TO_DEVICE_DATA);

      if (data[userId]) {
        if (!data[userId].includes(deviceId)) {
          data[userId].push(deviceId);
          await dbController.writeDatabase(CONSUMER_TO_DEVICE_DATA, data);
          return res.status(200).json({ message: 'Device assigned to consumer successfully.' });
        } else {
          return res.status(400).json({ message: 'Device already assigned to consumer.' });
        }
      } else {
        // Create a new entry for the userId and assign the deviceId
        data[userId] = [deviceId];
        // Write the updated data back to the JSON file
        await dbController.writeDatabase(CONSUMER_TO_DEVICE_DATA, data);
        // Respond with success message
        return res.status(200).json({ message: 'Device assigned to consumer successfully.' });
      }
    } catch (error) {

      console.error('Error assigning device to consumer:', error);
      return res.status(500).json({ error: 'Internal server error.' });
    }
  }


  async sync_pi_source_code(id) {
    await handleCloudMqttPublish(`${TOPIC_FOR_PI_SOURCE_CODE_SYNC}/${id}`, JSON.stringify({ "query": "git pull" }))
  }

  async generateQRCodes() {
    // Ensure the directory exists or create it if it doesn't
    if (!fs.existsSync(QRdirectoryPathForDevices)) {
      fs.mkdirSync(QRdirectoryPathForDevices, { recursive: true });
    }
  
    const allDeviceData = await this.fetchAllDevices();
    let deviceIds = Object.keys(allDeviceData);
  
    for (const deviceId of deviceIds) {
      const apiUrl = `http://139.59.27.195/device-info/${deviceId}`;
  
      // Sanitize deviceId to remove characters not suitable for filenames
      const sanitizedDeviceId = deviceId.replace(/[^a-z0-9]/gi, '-'); // Replace non-alphanumeric characters with hyphen
  
      // Define the complete file path including the file name
      const filePath = path.join(QRdirectoryPathForDevices, `QR_${sanitizedDeviceId}.png`);
  
      // Create a canvas
      const canvas = createCanvas(400, 500); // Create a canvas with extra space for the text
      const ctx = canvas.getContext('2d');
  
      // Generate QR code and draw it on the canvas
      await new Promise((resolve, reject) => {
        QRCode.toCanvas(createCanvas(300, 500), apiUrl, {
          margin: 2, // Margin around the QR code
          color: {
            dark: '#000',  // QR code color
            light: '#FFF'  // Background color
          }
        }, (error, qrCanvas) => {
          if (error) reject(error);
          
          const qrSize = 300;
          const qrX = (canvas.width - qrSize) / 2;
          const qrY = 50;
          ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);
          resolve();
        });
      });
  
      // Add deviceId text below the QR code
      ctx.font = 'bold 20px Arial';
      ctx.fillText("NUEZ SMART WATERMETER",50,400)
      ctx.font = 'bold 25px Arial';
      ctx.fillText(deviceId, 50, 430); // Adjust position as needed
  
      // Save the canvas as a PNG file
      const buffer = canvas.toBuffer('image/png');
      fs.writeFileSync(filePath, buffer);
  
      console.log(`QR code generated and saved as ${filePath}`);
    }
  }

  async downloadQRCode(res) {
    try {
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', 'attachment; filename=qr_generated.zip');

      const archive = archiver('zip', {
        zlib: { level: 9 } // Sets the compression level
      });

      archive.on('error', (err) => {
        throw err;
      });

      // Pipe the archive data to the response
      archive.pipe(res);

      // Append files from the QR directory for devices to the archive
      archive.directory(QRdirectoryPathForDevices, false);

      // Finalize the archive and send it
      archive.finalize();
    } catch (error) {
      console.error('Error sending zip folder:', error);
      res.status(500).send('Error sending zip folder');
    }
  }

  async generateSiteQRCodes() {
    // Ensure the directory exists or create it if it doesn't
    if (!fs.existsSync(QRdirectoryPathForSites)) {
      fs.mkdirSync(QRdirectoryPathForSites, { recursive: true });
    }
    const allSitesData = await this.fetchAllSites();
    let siteIds = Object.keys(allSitesData);
    for (const siteId of siteIds) {
      const apiUrl = `http://139.59.27.195/site-info/${siteId}`;
  
      // Sanitize deviceId to remove characters not suitable for filenames
      const sanitizedSiteId = siteId.replace(/[^a-z0-9]/gi, '-'); // Replace non-alphanumeric characters with hyphen
  
      // Define the complete file path including the file name
      const filePath = path.join(QRdirectoryPathForSites, `QR_${sanitizedSiteId}.png`);
  
      // Create a canvas
      const canvas = createCanvas(400, 500); // Create a canvas with extra space for the text
      const ctx = canvas.getContext('2d');
  
      // Generate QR code and draw it on the canvas
      await new Promise((resolve, reject) => {
        QRCode.toCanvas(createCanvas(300, 500), apiUrl, {
          margin: 2, // Margin around the QR code
          color: {
            dark: '#000',  // QR code color
            light: '#FFF'  // Background color
          }
        }, (error, qrCanvas) => {
          if (error) reject(error);
          
          const qrSize = 300;
          const qrX = (canvas.width - qrSize) / 2;
          const qrY = 50;
          ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);
          resolve();
        });
      });
  
      // Add deviceId text below the QR code
      ctx.font = 'bold 20px Arial';
      ctx.fillText("NUEZ Technologies",50,400)
      ctx.font = 'bold 25px Arial';
      ctx.fillText(siteId, 50, 430); // Adjust position as needed
  
      // Save the canvas as a PNG file
      const buffer = canvas.toBuffer('image/png');
      fs.writeFileSync(filePath, buffer);
  
      console.log(`QR code generated and saved as ${filePath}`);
    }
  }

  async downloadSiteQRCode(res) {
    try {
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', 'attachment; filename=qr_generated.zip');

      const archive = archiver('zip', {
        zlib: { level: 9 } // Sets the compression level
      });

      archive.on('error', (err) => {
        throw err;
      });

      // Pipe the archive data to the response
      archive.pipe(res);

      // Append files from the QR directory for sites to the archive
      archive.directory(QRdirectoryPathForSites, false);

      // Finalize the archive and send it
      archive.finalize();
    } catch (error) {
      console.error('Error sending zip folder:', error);
      res.status(500).send('Error sending zip folder');
    }
  }

  async intimateAllDevicesOfASite(req) {
    const site_id = req.params.site_id; // Correctly access site_id from req.params
    console.log(site_id);
    const message = { version: `${req.body.version}` }
    console.log(message)
    // Publish the message to the "site_1/intimate" topic

    handleCloudMqttPublish(`intimate-latest-version-info/${site_id}`, JSON.stringify(message))

  }
  async fetchDeviceVersion(req) {
    const site_id = req.params.site_id;
    handleCloudMqttPublish(`device-version-query/${site_id}`, "fetch versions from devices");
  }

  async intimateAllSites(req) {
    const message = { version: `${req.body.version}` }
    console.log(message)
    // Publish the message to the "site_1/intimate" topic

    handleCloudMqttPublish(`latest-firmware-version`, JSON.stringify(message))

  }

  ////////////////////// Maintenance Mode///////////////////////////////////////
  async maintenance_service(site_id, list_of_ids, action) {
    await handleCloudMqttPublish(`maintenance/${site_id}`, JSON.stringify({ list_of_ids: list_of_ids, action: action }))

  }
  async device_status_query(site_id) {
    await handleCloudMqttPublish(`device-status-query/${site_id}`, JSON.stringify({ "query": "send_device_status_info" }))

  }


  async enterMaintenance(req, res) {
    const list_of_ids = req.body.devices_id;
    const site_id = req.body.site_id;

    this.maintenance_service(site_id, list_of_ids, MAINTENANCE_ENTER);
    this.device_status_query(site_id);
    setTimeout(() => {
      res.json(deviceStatus[site_id])
    }, 7000);
  }

  async exitMaintenance(req, res) {
    const list_of_ids = req.body.devices_id;
    const site_id = req.body.site_id;
    this.maintenance_service(site_id, list_of_ids, MAINTENANCE_EXIT);
    this.device_status_query(site_id);
    setTimeout(() => {
      res.json(deviceStatus[site_id])
    }, 7000);
  }

  async fetchDeviceStatus(req, res) {
    const site_id = req.body.site_id;
    this.device_status_query(site_id);
    setTimeout(() => {
      res.json(deviceStatus[site_id])
      deviceStatus[site_id] = {};
    }, 5000);

  }
  async recieveBinFilesFromPi(req, res) {
    const id = req.params.id;
    const data = req.body.binFiles;

    // Check if data is an array
    if (!Array.isArray(data)) {
      return res.status(400).json({ success: false, message: 'Invalid data format' });
    }

    console.log(data);
    sitesBinFileNamesInMemory[id] = data;
    res.status(201).json({ success: true, message: 'Successfully registered' });
  }

  async fetchPiFirmwareVersions(req, res) {
    const id = req.params.id;
    handleCloudMqttPublish(`binary-list/${id}`, JSON.stringify({ "message": "send available binary list" }));

    setTimeout(() => {
      const binFiles = sitesBinFileNamesInMemory[id] || [];

      if (Array.isArray(binFiles)) {
        const formattedResponse = binFiles.map((name, index) => ({ id: index, name }));
        res.json(formattedResponse);
      } else {
        res.status(500).json({ success: false, message: 'Invalid binFiles format' });
      }

      sitesBinFileNamesInMemory[id] = {};
    }, 4000);
  }

  async getBinFilenamesWithoutExtension(directoryPath) {
    return new Promise((resolve, reject) => {
      fs.readdir(directoryPath, (err, files) => {
        if (err) {
          return reject('Unable to scan directory: ' + err);
        }
        // Filter out non-.bin files and remove .bin extension
        const binFiles = files
          .filter(file => file.endsWith('.bin'))
          .map(file => path.basename(file, '.bin'));

        resolve(binFiles);
        console.log(binFiles)
      });
    });
  }
  ////////////////AUTHORIZE_USER//////////////////////////////////
  roleAuthenticatorIdInSensitive = roleAuthenticatorIdInSensitive;
  roleAuthenticatorIdSensitive = roleAuthenticatorIdSensitive;
  isAuthenticated = isAuthenticated;
}

module.exports = new Controller();