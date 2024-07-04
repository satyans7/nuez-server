const dbController = require("../db-controller/db-controller");
const { passwordAuthController, otpAuthController, googleAuthController } = require("../auth-controller/auth-controller");
const otpGeneratorUtility = require("../utils/otp-generator")
const { roleAuthenticatorIdSensitive, roleAuthenticatorIdInSensitive, isAuthenticated } = require("../middlewares/auth")
const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');

const QRdirectoryPath = path.join(__dirname, 'qr_codes_generated');




class Controller {
  passport = googleAuthController;
  // roleAuthenticator=roleAuthenticator;
  //////////// FETCHING SAMPLE DATA///////////////////////////////////////////////
  async fetchSampleDataFromServer() {
    let data = await dbController.fetchSampleDataFromServer();
    console.log(data);
    return data;
  }

  ///////////////////////////////REGISTER A USER///////////////////////////////////
  async registerUser(req, res) {
    try {
      const email = req.body.email;

      // Check if email is reserved
      const isReserved = await dbController.isEmailReserved(email);

      if (isReserved) {

        return res.status(400).json({ success: false, message: 'Username already exists' });
      }

      // Validate email uniqueness
      const isUnique = await this.validateUniquenessOfUserName(email);

      if (isUnique) {

        return res.status(400).json({ success: false, message: 'Username already exists' });
      } else {
        // Register the new user
        const newUserId = await dbController.postUserDataToServer(req.body);
        // console.log('New user registered:', newUser);

        // Additional handling for admin role
        console.log(req.body.role);
        if (req.body.role === 'admin') {
          await dbController.postUserRequestToServer(newUserId, req.body.role);
        }

        return res.status(201).json({ success: true, message: 'Successfully registered' });
      }
    } catch (error) {
      console.error('Error in registerUser:', error.message);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }


  /////////////////////AUTHENTICATE USER/////////////////////////
  //isko mt chedna
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
            // return { success: true, route: route, message: 'Logged In Successfully' };
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
            // return { success: true, route: route, message: 'Logged In Successfully' };
          });
          // return { success: true, route: route, message: 'Logged In Successfully' };
        }
      }
      else {
        return res.status(401).json({ message: 'Invalid email or password' });
        // return { success: false, route: 'null', message: 'Invalid username or password!!!' };
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
    return await dbController.deleteUserById(userId);
  }
  ////////////////-----------------------------------------------------------------///////////////////


  //////////////////////////SEND A REQ FOR ROLE CHANGE///////////////////////////////////////////////
  async requestRoleChange(req) {
    let userId = req.body._id;
    // const user = await dbController.fetchUserById(userId);

    const reqRole = req.body.reqRole;
    await dbController.requestRoleChange(userId, reqRole);
  }
  ////////////////////////////DELETE THE REQ AND ADD TO LOG////////////////////////////////////////
  async roleChangeResponse(req) {
    const action = req.body.action;
    const userId = req.body._id;
    const delUser = await dbController.deleteReqByUserId(userId);
    const timeStamp = await this.getTimeAndDate();
    await dbController.addResponseToLog(delUser, req.body, timeStamp);
    if (action === "approved") {
      await dbController.roleChange(userId);
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
  //////////////////////////////////////////FIND USER BY EMAIL///////////////////
  async findUserByEmail(email) {
    // console.log(typeof(email));
    const users = await this.fetchAllUsers()
    // console.log(users);
    for (let userId in users) {
      // console.log(userId)
      if (users[userId].email === email) {
        // console.log("matched")
        return users[userId]
      }
    }
    return {}
  }
  ////////////////////////UNIQUENESS OF EMAIL/USERNAME////////////////////////////////////
  async validateUniquenessOfUserName(username) {
    const user = await this.findUserByEmail(username);
    // console.log(user);
    const size = Object.keys(user).length
    if (size) {
      return true;
    }
    else {
      return false;
    }
  }
  ////////////////////FETCH ALL USERS///////////////////////////////////////////////
  async fetchAllUsers() {
    let data = await dbController.fetchAllUsers();
    return data;
  }
  ////////////////////////////FETCH ALL ADMIN INFO/////////////////////////////////
  async fetchAllAdminInfo() {
    let data = await dbController.fetchAllUsers();

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
    let data = await dbController.fetchAllUsers();

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
    let data = await dbController.fetchRoleChangeReq();
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
    let data = await dbController.fetchApprovedLog();
    return data;
  }
  ////////////////////////FETCH THE DENIED LOG//////////////////////////////
  async fetchRejectedLog() {
    let data = await dbController.fetchRejectedLog();
    return data;
  }
  ///////////////////////FETCH A SINGLE USER BY ID//////////////////////////
  async fetchUserById(userId) {
    let data = await dbController.fetchUserById(userId);
    return data;
  }


  ///////////TESTING CONTROLLER///////////
  async test() {
    return await this.postUserRequestToServer();
  }

  async OTPGenerationAndStorage(email) {
    const otp = otpGeneratorUtility.generateOTP();
    await otpAuthController.sendVerificationEmail(email, otp);
    const OTPAlreadyRequested = await dbController.isOTPRequested(email);
    if (OTPAlreadyRequested) {
      return await dbController.updateotpemail(email, otp);
    }
    else return await dbController.saveotpemail(email, otp);
  }
  async OTPVerification(req, res, email, providedotp) {
    const authResult = await otpAuthController.verifyOTP(email, providedotp);
    if (authResult.success) {
      await dbController.deleteOTPByEmail(email);
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



  // const obj = new Controller();
  // obj.OTPGenerationAndStorage("priyansu.iitism@gmail.com");
  // obj.OTPVerification("priyansu.iitism@gmail.com","Wz8pRT");

  //ADMIN_TO_SITE_MAPPING
  async fetchAllAdminToSite() {
    let data = await dbController.fetchAllAdminToSite();
    return data;
  }

  //Fetch all sites
  async fetchAllSites() {
    let data = await dbController.fetchAllSites();
    return data;
  }

  async fetchAllSitesUnderAdmin(id) {
    let data = await dbController.fetchAllSitesUnderAdmin(id);
    return data;
  }
  // Site to device mapping

  async fetchAllSiteToDevice() {
    let data = await dbController.fetchAllSitetoDevice();
    return data;
  }

  // fetch all devices

  async fetchAllDevices() {
    let data = await dbController.fetchAllDevices();
    return data;
  }

  async fetchDeviceData(device_id) {
    let data = await this.fetchAllDevices();
    return data[device_id];
  }

  async fetchAllDevicesUnderSite(id) {
    let data = await dbController.fetchAllDevicesUnderSite(id);
    return data;
  }

  async fetchAllConsumersUnderSite(id) {
    let data = await dbController.fetchAllConsumersUnderSite(id);
    return data;
  }

  //fetch all consumer to device
  async fetchAllConsumerToDevice() {
    let data = await dbController.fetchAllConsumertoDevice();
    return data;
  }

  //fetch all site to consumer
  async fetchAllSiteToConsumer() {
    let data = await dbController.fetchAllSiteToConsumer();
    return data;
  }


  async putSite(req, res) {

    await dbController.putSite(req, res);
  }

  async putDevice(req, res) {

    await dbController.putDevice(req, res);
  }

  async registerSite(req, res) {
    await dbController.registerSite(req, res)
  }

  async deregisterSite(req, res) {
    await dbController.deregisterSite(req, res);

  }

  async registerDevice(req, res) {
    await dbController.registerDevice(req, res);
  }

  async deregisterDevice(req, res) {
    await dbController.deregisterDevice(req, res);

  }

  async registerConsumerToDeviceMapping(req, res) {
    await dbController.registerConsumerToDeviceMapping(req, res);
  }

  async deregisterConsumerToDeviceMapping(req, res) {
    await dbController.deregisterConsumerToDeviceMapping(req, res);
  }

  async registerConsumer(req, res) {
    await dbController.registerConsumer(req, res);
  }

  async deregisterConsumer(req, res) {
    await dbController.deregisterConsumer(req, res);

  }

  async AssignDevicetoConsumer(req, res) {

    await dbController.AssignDevicetoConsumer(req, res);
  }

  async postDevice(req, res) {

    await dbController.postDevice(req, res);
  }


  async generateQRCodes() {
    // Ensure the directory exists or create it if it doesn't
    if (!fs.existsSync(QRdirectoryPath)) {
      fs.mkdirSync(QRdirectoryPath);
    }
    const allDeviceData = await this.fetchAllDevices();
    let deviceIds = Object.keys(allDeviceData);
    deviceIds.forEach(deviceId => {
      const apiUrl = `http://192.168.33.250:4000/device-info/${deviceId}`;

      // Sanitize deviceId to remove characters not suitable for filenames
      const sanitizedDeviceId = deviceId.replace(/[^a-z0-9]/gi, '-'); // Replace non-alphanumeric characters with hyphen

      // Define the complete file path including the file name
      const filePath = path.join(QRdirectoryPath, `QR_${sanitizedDeviceId}.png`);

      // Generate QR code and save as image
      QRCode.toFile(filePath, apiUrl, {
        color: {
          dark: '#000',  // QR code color
          light: '#FFF'  // Background color
        }
      }, function (err) {
        if (err) throw err;
        console.log(`QR code generated and saved as ${filePath}`);
      });
    })

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
  
      // Append files from the local repo directory to the archive
      archive.directory(QRdirectoryPath, false);
  
      // Finalize the archive and send it
      archive.finalize();
    } catch (error) {
      console.error('Error sending zip folder:', error);
      res.status(500).send('Error sending zip folder');
    }
  }

  ////////////////AUTHORIZE_USER//////////////////////////////////
  roleAuthenticatorIdInSensitive = roleAuthenticatorIdInSensitive;
  roleAuthenticatorIdSensitive = roleAuthenticatorIdSensitive;
  isAuthenticated = isAuthenticated;
}

module.exports = new Controller();
