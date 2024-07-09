
const path = require("path");
const controller = require("../controller/controller.js");
const fs = require("fs");
const { exec } = require("child_process");
const SUPERADMIN = "/superAdmin"
MAINTENANCE_ENTER = "enter"
MAINTENANCE_EXIT = "exit"
const { botFunction } = require("../telegramAlarm/botFather.js");
const { initializeTopics } = require("../mqtt/helper.js");
const { handleCloudMqttConnect, handleCloudMqttMessage } = require("../mqtt/mqtt.js");

module.exports = function (app) {
  
  const permForAdmin = "admin";
  const permForConsumer = "consumer";
  const permForSuperAdmin = "superAdmin";

  //Pages
  const ADMINPAGE = path.join(__dirname, "../views/pages", "admin.html");
  const CONSUMERPAGE = path.join(__dirname, "../views/pages", "consumer.html");
  const SUPERADMINPAGE = path.join(__dirname,"../views/pages","superAdmin.html");
  const SITEPAGE = path.join(__dirname, "../views/pages", "siteToDevice.html");
  const DEVICEPROFILE = path.join(__dirname,"../views/pages","deviceProfile.html");
  const DEVICEINFO = path.join(__dirname, "../views/pages", "deviceInfo.html")
  const BUTTONMAP = path.join(__dirname, "../database/json-data/buttonMappings.json");

  //Scripts
  const FIRMWARESYNC = path.join(__dirname, "../../../firmwareScript.sh");
  const SOURCECODESYNC = path.join(__dirname, "../../../sourceCodeScript.sh");

  //private
  const PRIVATE_AEP_TO_ADMINROUTE = "/api/admin-dashboard/:id";
  const PRIVATE_AEP_TO_CONSUMERROUTE = "/api/consumer-dashboard/:id";
  const PRIVATE_AEP_TO_SITES = "/api/site-dashboard/:id";
  const PRIVATE_AEP_TO_DEVICEPROFILE = "/api/device-profile/:id";

  //public
  const PUBLIC_AEP_TO_DEVICE_INFO = "/device-info/:deviceId"
  const AEP_TO_REGISTER_A_USER = "/api/user/register";
  const AEP_TO_AUTHENTICATE_A_USER = "/api/user/authenticate";
  const AEP_TO_UPDATE_PROFILE_OF_A_USER = "/api/user/profile/:id";
  const AEP_TO_FETCH_ALL_CONSUMERS = "/api/consumer";
  const AEP_TO_FETCH_ALL_ADMINS = "/api/admin";
  const AEP_TO_FETCH_USER_BY_ID = "/api/user/:id";
  const AEP_TO_DELETE_A_USER = "/api/user/terminate/:id";
  const AEP_TO_REQUEST_FOR_ROLE_CHANGE = "/api/user/request/:id";
  const AEP_TO_FETCH_ROLE_CHANGE_REQ = "/api/user/role-change-req";
  const AEP_FOR_ROLE_CHANGE_RESPONSE = "/api/user/response/:id";
  const AEP_TO_FETCH_APPROVED_LOG = "/api/response/approved";
  const AEP_TO_FETCH_DENIED_LOG = "/api/response/denied";
  const AEP_TO_FETCH_ALL_ADMINS_TO_SITES = "/api/admin/admintosite";
  const AEP_TO_FETCH_ALL_SITES = "/api/admin/sites";
  const AEP_TO_FETCH_SITES_UNDER_AN_ADMIN = '/api/admin/allsites/:id';
  const AEP_TO_FETCH_ALL_DEVICES_UNDER_A_SITE = '/api/admin/alldevices/:id';
  const AEP_TO_FETCH_ALL_CONSUMERS_UNDER_A_SITE = '/api/admin/allconsumers/:id';
  const AEP_TO_FETCH_ALL_SITES_TO_DEVICES = "/api/admin/sitetodevice";
  const AEP_TO_FETCH_ALL_DEVICES = "/api/admin/devices";
  const AEP_TO_GENERATE_OTP = "/api/generateotp";
  const AEP_TO_VERIFY_OTP = "/api/verifyotp";
  const AEP_TO_FETCH_ALL_SITES_TO_CONSUMERS = "/api/admin/sitetoconsumer";
  const AEP_TO_FETCH_CONSUMERS_TO_DEVICES = "/api/consumer/consumertodevice";
  const AEP_TO_PUT_SITE = "/api/admin/sites/:id";
  const AEP_TO_PUT_DEVICE = "/api/admin/devices/:id";
  const AEP_TO_FETCH_USER_DATA_FROM_GOOGLEAUTH = "/api/fetchDataFromGoogle";
  const AEP_TO_REGISTER_SITE = "/api/admin/registersite/:id";
  const AEP_TO_DEREGISTER_SITE = "/api/admin/deregistersite/:id";
  const AEP_TO_REGISTER_DEVICE = "/api/admin/registerdevice/:id";
  const AEP_TO_DEREGISTER_DEVICE = "/api/admin/deregisterdevice/:id";
  const AEP_TO_REGISTER_CONSUMER = "/api/admin/registerconsumer/:id";
  const AEP_TO_DEREGISTER_CONSUMER = "/api/admin/deregisterconsumer/:id";
  const AEP_TO_REGISTER_CONSUMER_TO_DEVICE_MAPPING ="/api/admin/registerconsumertodevice/:id";
  const AEP_TO_DEREGISTER_CONSUMER_TO_DEVICE_MAPPING ="/api/admin/deregisterconsumertodevice/:id";
  const AEP_TO_ASSIGN_AN_EXISTING_DEVICE_TO_A_CONSUMER ="/api/admin/assigndevicetoconsumer/:id";
  const AEP_TO_FETCH_ALL_AVAILABLE_FIRMWARE_VERSIONS = '/api/firmware-versions';
  const AEP_TO_INTIMATE_ALL_DEVICES_UNDER_A_SITE = "/:site_id/intimate-all-devices";
  const AEP_TO_FETCH_ALL_DEVICES_FIRMWARE_VERSIONS = "/:site_id/fetch-device-versions";
  const AEP_TO_ENTER_A_DEVICE_IN_MAINTENANCE_MODE = '/api/maintenance/enter';
  const AEP_TO_EXIT_A_DEVICE_FROM_MAINTENANCE_MODE = '/api/maintenance/exit';
  const AEP_TO_FETCH_ALL_DEVICES_MODES = '/api/device-status';
  const AEP_TO_FETCH_A_HTML_FRAGMENT_UNDER_A_PAGE = '/api/html/:role/:key';
  const AEP_TO_POST_DEVICE = "/api/admin/newdevice/:id";
  const AEP_TO_SYNC_FIRMWARE_DATA = "/api/sync-firmware";
  const AEP_TO_SYNC_SOURCECODE = "/api/sync-sourcecode";
  const AEP_TO_FETCH_DEVICE_DATA = "/api/device/:deviceId"
  const AEP_TO_GENERATE_DEVICE_INFO_QR = `/api/generate/deviceQR`;
  const AEP_TO_DOWNLOAD_DEVICE_INFO_QR = "/api/download/deviceQR";
  const AEP_TO_GET_BUTTON_MAPPING='/api/buttonMapping'


  ////////REGISTERING A USER///////
  app.post(AEP_TO_REGISTER_A_USER, async (req, res) => {
    // console.log("registering")
    await controller.registerUser(req, res);
  });
  ////////LOGIN A USER / AUTHENTICATE/////////
  app.post(AEP_TO_AUTHENTICATE_A_USER, async (req, res) => {
    const data = await controller.authenticateUser(req, res, req.body);
    // if (data.success) {
    //   return res.json(data);
    // } else {
    //   return res.status(401).json({ message: 'Invalid email or password' });
    // }
  });
  //////////////////////////////////////////FETCH DATA//////////////////////////////////////////////////

  ///////////FETCH ALL CONSUMERS///////////
  app.get(AEP_TO_FETCH_ALL_CONSUMERS, async (req, res) => {
    const data = await controller.fetchAllConsumerInfo();
    res.json(data);
  });
  /////////FETCH ALL ADMINS/////////////////
  app.get(AEP_TO_FETCH_ALL_ADMINS, async (req, res) => {
    const data = await controller.fetchAllAdminInfo();
    res.json(data);
  });
  //////////FETCH DATA FROM ROLE CHANGE REQ DB///////////
  app.get(AEP_TO_FETCH_ROLE_CHANGE_REQ, async (req, res) => {
    const data = await controller.fetchRoleChangeReq();
    res.json(data);
  });
  //////////FETCH ALL DATA FROM APPROVED LOG////////////
  app.get(AEP_TO_FETCH_APPROVED_LOG, async (req, res) => {
    const data = await controller.fetchApprovedLog();
    res.json(data);
  });
  //////////FETCH ALL DATA FROM DENIED LOG////////////
  app.get(AEP_TO_FETCH_DENIED_LOG, async (req, res) => {
    const data = await controller.fetchRejectedLog();
    res.json(data);
  });
  ////////////FETCH A SINGLE USER BY ID////////////////
  app.get(AEP_TO_FETCH_USER_BY_ID, async (req, res) => {
    const data = await controller.fetchUserById(req.params.id);
    res.json(data);
  });

  ///----------------------------------------------------------------------------------------------------/////

  /////////////SEND A ROLE CHANGE REQ/////////////////////////
  app.post(AEP_TO_REQUEST_FOR_ROLE_CHANGE, async (req, res) => {
    await controller.requestRoleChange(req);
    res.sendStatus(200); // Sending a status to indicate success
  });
  //////////////SEND THE RESPONSE FOR A REQUEST////////////////////
  app.post(AEP_FOR_ROLE_CHANGE_RESPONSE, async (req, res) => {
    await controller.roleChangeResponse(req);
    res.sendStatus(200); // Sending a status to indicate success
  });

  ////////////PROTECTED ROUTES FOR PAGES RENDERING//////////////////
  app.get(PRIVATE_AEP_TO_ADMINROUTE, controller.isAuthenticated(),controller.roleAuthenticatorIdSensitive(permForAdmin),(req, res) => {
      res.sendFile(ADMINPAGE);
  });

  app.get(PRIVATE_AEP_TO_CONSUMERROUTE, controller.isAuthenticated(),controller.roleAuthenticatorIdSensitive(permForConsumer),(req, res) => {
      res.sendFile(CONSUMERPAGE);
  });

  app.get(SUPERADMIN, (req, res) => {
    res.sendFile(SUPERADMINPAGE);
  });

  app.get(PRIVATE_AEP_TO_SITES, (req, res) => {
    res.sendFile(SITEPAGE);
  });

  app.get(PRIVATE_AEP_TO_DEVICEPROFILE, (req, res) => {
    res.sendFile(DEVICEPROFILE);
  });

  app.get(PUBLIC_AEP_TO_DEVICE_INFO, async (req, res) => {
    res.sendFile(DEVICEINFO);
  })

  // LOGIN VIA OTP
  app.post(AEP_TO_GENERATE_OTP, async (req, res) => {
    const email = await controller.OTPGenerationAndStorage(req.body.email);
    return res
      .status(200)
      .json({ message: `Otp has been sent to ${email} successfully!!!` });
  });

  app.post(AEP_TO_VERIFY_OTP, async (req, res) => {
    const data = await controller.OTPVerification(
      req,
      res,
      req.body.email,
      req.body.otp
    );
    // return res.status(401).json({ message: 'Wrong OTP !!! Try Again' });
  });


  //ADMIN PAGE  ADMIN_TO_SITE_MAPPING
  app.get(AEP_TO_FETCH_ALL_ADMINS_TO_SITES, async (req, res) => {
    const data = await controller.fetchAllAdminToSite();
    res.json(data);
  });

  //fetch all sites

  app.get(AEP_TO_FETCH_ALL_SITES, async (req, res) => {
    try {
      const data = await controller.fetchAllSites();
      res.json(data);
    } catch (error) {
      res.status(500).send("Internal Server Error");
    }
  });

  app.get(AEP_TO_FETCH_SITES_UNDER_AN_ADMIN, async (req, res) => {
    try {
      const id = req.params.id;
      const data = await controller.fetchAllSitesUnderAdmin(id);
      res.json(data);

    } catch (error) {
      res.status(500).send("Internal Server Error");

    }
  })

  //sites to device mapping

  app.get(AEP_TO_FETCH_ALL_SITES_TO_DEVICES, async (req, res) => {
    const data = await controller.fetchAllSiteToDevice();
    res.json(data);
  });

  // fetch all devices

  app.get(AEP_TO_FETCH_ALL_DEVICES, async (req, res) => {
    try {
      const data = await controller.fetchAllDevices();
      res.json(data);
    } catch (error) {
      res.status(500).send("Internal Server Error");
    }
  });

  
  app.get(AEP_TO_FETCH_ALL_DEVICES_UNDER_A_SITE, async (req, res) => {
    try {
      const id = req.params.id;
      const data = await controller.fetchAllDevicesUnderSite(id);
      res.json(data);

    } catch (error) {
      res.status(500).send("Internal Server Error");

    }
  })

  app.get(AEP_TO_FETCH_ALL_CONSUMERS_UNDER_A_SITE, async (req, res) => {
    try {
      const id = req.params.id;
      const data = await controller.fetchAllConsumersUnderSite(id);
      res.json(data);

    } catch (error) {
      res.status(500).send("Internal Server Error");

    }
  })

  //consumer to device mapping
  app.get(AEP_TO_FETCH_CONSUMERS_TO_DEVICES, async (req, res) => {
    try {
      const data = await controller.fetchAllConsumerToDevice();
      res.json(data);
    } catch (error) {
      res.status(500).send("Internal Server Error");
    }
  });

  app.get(AEP_TO_FETCH_ALL_SITES_TO_CONSUMERS, async (req, res) => {
    try {
      const data = await controller.fetchAllSiteToConsumer();
      res.json(data);
    } catch (error) {
      res.status(500).send("Internal Server Error");
    }
  });

  app.put(AEP_TO_PUT_SITE, async (req, res) => {
    await controller.putSite(req, res);
  });

  app.put(AEP_TO_PUT_DEVICE, async (req, res) => {
    await controller.putDevice(req, res);
  });

  app.post(AEP_TO_REGISTER_SITE, async (req, res) => {
    await controller.registerSite(req, res);
  });
  app.delete(AEP_TO_DEREGISTER_SITE, async (req, res) => {
    await controller.deregisterSite(req, res);
  });

  app.post(AEP_TO_REGISTER_DEVICE, async (req, res) => {
    await controller.registerDevice(req, res);
  });

  app.delete(AEP_TO_DEREGISTER_DEVICE, async (req, res) => {
    await controller.deregisterDevice(req, res);
  });

  app.post(AEP_TO_REGISTER_CONSUMER, async (req, res) => {
    await controller.registerConsumer(req, res);
  });

  app.delete(AEP_TO_DEREGISTER_CONSUMER, async (req, res) => {
    await controller.deregisterConsumer(req, res);
  });

  app.post(AEP_TO_REGISTER_CONSUMER_TO_DEVICE_MAPPING, async (req, res) => {
    await controller.registerConsumerToDeviceMapping(req, res);
  });

  app.delete(AEP_TO_DEREGISTER_CONSUMER_TO_DEVICE_MAPPING, async (req, res) => {
    await controller.deregisterConsumerToDeviceMapping(req, res);
  });

  app.patch(AEP_TO_ASSIGN_AN_EXISTING_DEVICE_TO_A_CONSUMER,async (req, res) => {
      await controller.AssignDevicetoConsumer(req, res);
    }
  );

  app.post(AEP_TO_POST_DEVICE, async (req, res) => {
    await controller.postDevice(req, res);
  });
  app.get(AEP_TO_FETCH_DEVICE_DATA, async (req, res) => {
    try {
      const data = await controller.fetchDeviceData(req.params.deviceId);
      res.json(data);
    } catch (error) {
      res.status(500).send("Internal Server Error");
    }
  })


  // Variable to store bin filenames in memory
  let binFilenamesInMemory = [];
  const localRepoPath = path.join(__dirname, '../local-repo');
  // Initialize and store bin filenames in memory
  async function initializeBinFilenames() {
    try {
      binFilenamesInMemory = await controller.getBinFilenamesWithoutExtension(localRepoPath);
      console.log('Bin filenames without extension stored in memory:', binFilenamesInMemory);
    } catch (error) {
      console.error('Error reading bin filenames:', error);
    }
  }

  app.get(AEP_TO_FETCH_ALL_AVAILABLE_FIRMWARE_VERSIONS, (req, res) => {
    initializeBinFilenames();
    res.json(binFilenamesInMemory.map((name, id) => ({ id, name })));
  });

  
  app.post(AEP_TO_INTIMATE_ALL_DEVICES_UNDER_A_SITE, async (req, res) => {
    try {
      await controller.intimateAllDevicesOfASite(req);
      res.status(200).json({ message: "Intimate message sent to all devices" });
    } catch (error) {
      console.error("Error intimating all devices:", error);
      res.status(500).json({ error: "Failed to intimate all devices" });
    }
  });

  
  app.post(AEP_TO_FETCH_ALL_DEVICES_FIRMWARE_VERSIONS, async (req, res) => {
    try {
      await controller.fetchDeviceVersion(req);
      res.status(200).json({ message: "Message published successfully" });
    } catch (error) {
      console.error("Error publishing message:", error);
      res.status(500).json({ error: "Failed to publish message" });
    }
  });

  
  //// Enter Maintenance Mode
  app.post(AEP_TO_ENTER_A_DEVICE_IN_MAINTENANCE_MODE, async (req, res) => {
    await controller.enterMaintenance(req, res);
  });

  
  // Exit maintenance mode route
  app.post(AEP_TO_EXIT_A_DEVICE_FROM_MAINTENANCE_MODE, async (req, res) => {
    await controller.exitMaintenance(req, res);
  });

  
  app.post(AEP_TO_FETCH_ALL_DEVICES_MODES, async (req, res) => {
    await controller.fetchDeviceStatus(req, res);
  })

  app.get(AEP_TO_FETCH_USER_DATA_FROM_GOOGLEAUTH, (req, res) => {
    let userData = {
      name: "",
      email: "",
    };
    if (req.user) {
      (userData.name = req.user.name), (userData.email = req.user.email);
    }
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
    });
    res.json(userData || {});
  });

  app.get(AEP_TO_SYNC_FIRMWARE_DATA, (req, res) => {
    exec(FIRMWARESYNC, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        res.status(500).send(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        res.status(500).send(`stderr: ${stderr}`);
        return;
      }
      res.send(`stdout: ${stdout}`);
    });
  });
  app.get(AEP_TO_SYNC_SOURCECODE, (req, res) => {
    exec(SOURCECODESYNC, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        res.status(500).send(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        res.status(500).send(`stderr: ${stderr}`);
        return;
      }
      res.send(`stdout: ${stdout}`);
    });
  });

  app.get(AEP_TO_FETCH_A_HTML_FRAGMENT_UNDER_A_PAGE, (req, res) => {
    const { role, key } = req.params;
    const filePath = path.join(__dirname, '../views/html_fragments', role, `${key}.html`);

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return res.status(404).send('Fragment not found');
      }

      const contentMatch = data.match(/<!-- content -->([\s\S]*?)<!--/);
      const helpMatch = data.match(/<!-- help -->([\s\S]*?)$/);

      if (contentMatch && helpMatch) {
        const content = contentMatch[1].trim();
        const help = helpMatch[1].trim();
        res.json({ content, help });
      } else {
        res.status(500).send('Invalid HTML fragment format');
      }
    });
  });

  app.get(AEP_TO_GET_BUTTON_MAPPING, async (req, res) => {
    res.sendFile(BUTTONMAP);
  })

  app.get(AEP_TO_GENERATE_DEVICE_INFO_QR, async (req, res) => {
    try {
      await controller.generateQRCodes();
      res.send("generated successfully")
    }
    catch (error) {
      res.status(500).send("Internal Server Error");
    }

  })

  app.get(AEP_TO_DOWNLOAD_DEVICE_INFO_QR, async (req, res) => {
    await controller.downloadQRCode(res);


  })

  const topics = initializeTopics();
  handleCloudMqttConnect(topics);
  handleCloudMqttMessage(topics);
  setTimeout(botFunction, 20000);


};
