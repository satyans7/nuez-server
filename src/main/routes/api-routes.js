const path = require("path");
const controller = require("../controller/controller.js");
const fs = require("fs");
const mqtt = require("mqtt");
const { exec } = require("child_process");
const archiver = require('archiver');
const SUPERADMIN = "/superAdmin"
MAINTENANCE_ENTER = "enter"
MAINTENANCE_EXIT = "exit"
module.exports = function (app) {
  const AEP_SAMPLE = "/api/sample";
  app.get(AEP_SAMPLE, async (req, res) => {
    const data = await controller.fetchSampleDataFromServer();
    res.send(data);
  });
  const permForAdmin = "admin";
  const permForConsumer = "consumer";
  const permForSuperAdmin = "superAdmin";

  const ADMINPAGE = path.join(__dirname, "../views/pages", "admin.html");
  const CONSUMERPAGE = path.join(__dirname, "../views/pages", "consumer.html");
  const SUPERADMINPAGE = path.join(
    __dirname,
    "../views/pages",
    "superAdmin.html"
  );
  const SITEPAGE = path.join(__dirname, "../views/pages", "siteToDevice.html");
  const DEVICEPROFILE = path.join(
    __dirname,
    "../views/pages",
    "deviceProfile.html"
  );
  const FIRMWARESYNC = path.join(__dirname, "../../../firmwareScript.sh");
  const SOURCECODESYNC = path.join(__dirname, "../../../sourceCodeScript.sh");

  //private
  const PRIVATE_AEP_TO_ADMINROUTE = "/api/admin-dashboard/:id";
  const PRIVATE_AEP_TO_CONSUMERROUTE = "/api/consumer-dashboard/:id";
  const PRIVATE_AEP_TO_SITES = "/api/site-dashboard/:id";
  const PRIVATE_AEP_TO_DEVICEPROFILE = "/api/device-profile/:id";

  //public

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

  const AEP_TO_REGISTER_CONSUMER_TO_DEVICE_MAPPING =
    "/api/admin/registerconsumertodevice/:id";
  const AEP_TO_DEREGISTER_CONSUMER_TO_DEVICE_MAPPING =
    "/api/admin/deregisterconsumertodevice/:id";

  const AEP_TO_ASSIGN_AN_EXISTING_DEVICE_TO_A_CONSUMER =
    "/api/admin/assigndevicetoconsumer/:id";
  const AEP_TO_POST_DEVICE = "/api/admin/newdevice/:id";
  const AEP_TO_SYNC_FIRMWARE_DATA = "/api/sync-firmware";
  const AEP_TO_SYNC_SOURCECODE = "/api/sync-sourcecode";
  const AEP_TO_SEND_FIRMWARE = "/send-firmware";

  const AEP_TO_FETCH_DEVICE_DATA ="/api/device/:deviceId"
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
  app.get(
    PRIVATE_AEP_TO_ADMINROUTE,controller.isAuthenticated(),
    controller.roleAuthenticatorIdSensitive(permForAdmin),
    (req, res) => {
      res.sendFile(ADMINPAGE);
    }
  );

  app.get(
    PRIVATE_AEP_TO_CONSUMERROUTE,controller.isAuthenticated(),
    controller.roleAuthenticatorIdSensitive(permForConsumer),
    (req, res) => {
      res.sendFile(CONSUMERPAGE);
    }
  );

  app.get(SUPERADMIN, (req, res) => {
    res.sendFile(SUPERADMINPAGE);
  });

  app.get(PRIVATE_AEP_TO_SITES, (req, res) => {
    res.sendFile(SITEPAGE);
  });

  app.get(PRIVATE_AEP_TO_DEVICEPROFILE, (req, res) => {
    res.sendFile(DEVICEPROFILE);
  });

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

  ///////////TESTING ROUTES////////////////
  app.post("/test-url", async (req, res) => {
    let data = await controller.test();
    res.json(data);
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

  app.get('/api/admin/allsites/:id', async(req, res) => {
    try {
      const id = req.params.id;
      const data = await controller.fetchAllSitesUnderAdmin(id);
      res.json(data);
      
    } catch (error) {
      res.status(500).send("Internal Server Error");
      
    }
  })

  app.get('/src/main/views/pages/superAdmin.html',async(req,res)=>{
    res.sendFile(SUPERADMINPAGE);
  })
  const BUTTONMAP = path.join(__dirname, "../database/json-data/buttonMappings.json");
  app.get('/buttonMap',async(req,res)=>{
    res.sendFile(BUTTONMAP);
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

  // fetch a single device data
  app.get(AEP_TO_FETCH_DEVICE_DATA, async(req,res)=>{
    try {
      const data = await controller.fetchDeviceData(req.params.deviceId);
      res.json(data);
    } catch (error) {
      res.status(500).send("Internal Server Error");
    }
  })

  app.get('/api/admin/alldevices/:id', async(req, res) => {
    try {
      const id = req.params.id;
      const data = await controller.fetchAllDevicesUnderSite(id);
      res.json(data);
      
    } catch (error) {
      res.status(500).send("Internal Server Error");
      
    }
  })

  app.get('/api/admin/allconsumers/:id', async(req, res) => {
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

  app.patch(
    AEP_TO_ASSIGN_AN_EXISTING_DEVICE_TO_A_CONSUMER,
    async (req, res) => {
      await controller.AssignDevicetoConsumer(req, res);
    }
  );

  app.post(AEP_TO_POST_DEVICE, async (req, res) => {
    await controller.postDevice(req, res);
  });

  const localRepoPath = path.join(__dirname, '../local-repo');

function getBinFilenamesWithoutExtension(directoryPath) {
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

// Variable to store bin filenames in memory
let binFilenamesInMemory = [];

// Initialize and store bin filenames in memory
async function initializeBinFilenames() {
  try {
      binFilenamesInMemory = await getBinFilenamesWithoutExtension(localRepoPath);
      console.log('Bin filenames without extension stored in memory:', binFilenamesInMemory);
  } catch (error) {
      console.error('Error reading bin filenames:', error);
  }
}

initializeBinFilenames();
app.get('/api/firmware-versions', (req, res) => {
  res.json(binFilenamesInMemory.map((name, id) => ({ id, name })));
});
  // const updateRepo = async () => {
  //   const git = simpleGit();

  //   if (!fs.existsSync(localRepoPath)) {
  //     // Clone the repository if it doesn't exist
  //     console.log('Cloning the repository...');
  //     await git.clone(githubRepoUrl, localRepoPath);
  //   } else {
  //     // Pull the latest changes if the repository exists
  //     console.log('Pulling the latest changes...');
  //     await git.cwd(localRepoPath);
  //     await git.pull();
  //   }
  // };

  // // Define a route for the button click to update the repository
  // app.get(AEP_TO_SYNC_FIRMWARE_DATA, async (req, res) => {
  //   try {
  //     await updateRepo();
  //     res.send('Repository updated successfully!');
  //   } catch (error) {
  //     console.error('Error updating repository:', error);
  //     res.status(500).send('Error updating repository');
  //   }
  // });

  app.get(AEP_TO_SEND_FIRMWARE, async (req, res) => {
    // res.send("api called");
    console.log("api called");
  });

  const siteIdsFilePath = path.join(__dirname, "../database/json-data/siteRegistration.json");
  const deviceIdsFilePath = path.join(__dirname, "../database/json-data/deviceToProfile.json");
  const siteToDeviceFilePath = path.join(__dirname, "../database/json-data/siteToDevices.json");
  

  
  const deviceStatus = {};
  
  // Utility functions for database operations
  const readDatabase = (filePath) => {
    return JSON.parse(fs.readFileSync(filePath));
  }
  
  const writeDatabase = (filePath, data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  }
    // In-memory storage for site and device data
    const siteIds =readDatabase(siteIdsFilePath);
    const deviceIds =readDatabase(deviceIdsFilePath);
    const siteToDevice =readDatabase(siteToDeviceFilePath);
  
  // Function to get the current timestamp from NTP server
  const fetchNetworkTime = () => {
    // return new Promise((resolve, reject) => {
    //   ntpClient.getNetworkTime("pool.ntp.org", 123, (err, date) => {
    //     if (err) {
    //       return reject(err);
    //     }
    //     resolve(date);
    //   });
    // });
    const localTime = new Date();
    // console.log('Using local time:', localTime);
    return localTime.toLocaleString();
  }
  
  const client = mqtt.connect("mqtt://192.168.33.250", {
    port: 1883,
    username: "nuez",
    password: "emqx@nuez",
  });

  // Function to subscribe to a topic
  const subscribeToTopic = (topic) => {
    client.subscribe(topic, (err) => {
      if (err) {
        console.error(`Error subscribing to ${topic} topic:`, err);
      } else {
        console.log(`Subscribed to ${topic} topic.`);
      }
    });
  }
  
  const handleRegistration = (siteId, deviceId) => {
    if (!siteIds[siteId]) {
      siteIds[siteId] = { name: siteId, location: "default" };
      writeDatabase(siteIdsFilePath, siteIds);
    }
  
    if (!deviceIds[deviceId]) {
      deviceIds[deviceId] = { name: deviceId, location: "default" };
      writeDatabase(deviceIdsFilePath, deviceIds);
    }
  
    if (!siteToDevice[siteId]) {
      siteToDevice[siteId] = [];
    }
  
    if (!siteToDevice[siteId].includes(deviceId)) {
      siteToDevice[siteId].push(deviceId);
      writeDatabase(siteToDeviceFilePath, siteToDevice);
    }
  }

  
  // Function to update device data
  const updateDeviceData = (filePath, dataKey, updateData) => {
    const rawData = readDatabase(filePath);
    for (const [device_id, data] of Object.entries(updateData)) {
      if (rawData.hasOwnProperty(device_id)) {
        rawData[device_id][dataKey] = data;
      }
    }
    writeDatabase(filePath, rawData);
    console.log(`Device ${dataKey}s updated successfully.`);
  }
  
  // MQTT client event handlers
  client.on("connect", () => {
    console.log("Connected to MQTT broker");
  
    // Subscribe to necessary topics
    const topics = [
      "water-consumption-data",
      "device-status-info/#",
      "device-version-info/#",
      "device-heartbeat-info/#"
    ];
    topics.forEach(subscribeToTopic);
  });
  
  client.on("message", async (topic, message) => {
    const [topicName, siteId] = topic.split("/");
    const parsedMessage = JSON.parse(message.toString());
  
    switch (topicName) {
      case "water-consumption-data":
        const { site_id, device_id } = parsedMessage;
        handleRegistration(site_id, device_id);
        break;
  
      case "device-status-info":
        deviceStatus[siteId] = parsedMessage;
        updateDeviceData(
          path.join(__dirname, "../database/json-data/deviceToProfile.json"),
          "status",
          parsedMessage
        );
        break;
  
      case "device-version-info":
        updateDeviceData(
          path.join(__dirname, "../database/json-data/deviceToProfile.json"),
          "version",
          parsedMessage
        );
        break;
  
      case "device-heartbeat-info":
        try {
          const networkTime = await fetchNetworkTime();
          updateDeviceData(
            path.join(__dirname, "../database/json-data/deviceToProfile.json"),
            "timestamp",
            { ...parsedMessage, timestamp: networkTime }
          );
        } catch (error) {
          console.error("Error fetching network time:", error);
        }
        break;
  
      default:
        console.error("Unhandled topic:", topic);
    }
  });

app.get('/download/firmware', async (req, res) => {
  try {
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename=local-repo.zip');

    const archive = archiver('zip', {
      zlib: { level: 9 } // Sets the compression level
    });

    archive.on('error', (err) => {
      throw err;
    });

    // Pipe the archive data to the response
    archive.pipe(res);

    // Append files from the local repo directory to the archive
    archive.directory(localRepoPath, false);

    // Finalize the archive and send it
    archive.finalize();
  } catch (error) {
    console.error('Error sending zip folder:', error);
    res.status(500).send('Error sending zip folder');
  }
});

  app.post("/:site_id/intimate-all-devices", async (req, res) => {
    try {
      const site_id = req.params.site_id; // Correctly access site_id from req.params
      console.log(site_id);
      const message = { version:`${req.body.version}` }
      console.log(message)
      // Publish the message to the "site_1/intimate" topic
      client.publish(`intimate-latest-version-info/${site_id}`, JSON.stringify(message));

      res.status(200).json({ message: "Intimate message sent to all devices" });
    } catch (error) {
      console.error("Error intimating all devices:", error);
      res.status(500).json({ error: "Failed to intimate all devices" });
    }
  });

  app.post("/:site_id/fetch-device-versions", async (req, res) => {
    const site_id = req.params.site_id; // Correctly access site_id from req.params
    try {
      // Publish the message to the MQTT topic
      client.publish(`device-version-query/${site_id}`, "fetch versions from devices");
      res.status(200).json({ message: "Message published successfully" });
    } catch (error) {
      console.error("Error publishing message:", error);
      res.status(500).json({ error: "Failed to publish message" });
    }
  });



  app.post("/intimate-all-sites", (req, res) => {
    const firmwareFilePath = path.join(
      __dirname,"../local-repo","version.json");
    fs.readFile(firmwareFilePath, "utf8", (err, data) => {
      if (err) {
        console.error("Failed to read firmware.txt:", err);
        res.status(500).send("Failed to read firmware version.");
        return;
      }

      client.publish("latest-firmware-version", data, (err) => {
        if (err) {
          console.error("Failed to publish firmware version:", err);
          res.status(500).send("Failed to publish firmware version.");
          return;
        }

        res.send("Firmware version sent successfully.");
      });
    });
  });

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

  ////////////////////// Maintenance Mode///////////////////////////////////////
  async function maintenance_service(site_id, list_of_ids, action) {
    // Publish MQTT message to enter/exit maintenance mode
    await client.publish(`maintenance/${site_id}`, JSON.stringify({ list_of_ids: list_of_ids, action: action }));
  }
  async function device_status_query(site_id){
    await client.publish(`device-status-query/${site_id}`, JSON.stringify({ "query": "send_device_status_info" }));
  }

  //// Enter Maintenance Mode
  app.post('/api/maintenance/enter', async (req, res) => {
    const list_of_ids = req.body.devices_id;
    const site_id = req.body.site_id;
   
    maintenance_service(site_id, list_of_ids, MAINTENANCE_ENTER);
    setTimeout(() => {
      device_status_query(site_id);
      }, 1000);
    setTimeout(() => {
        res.json(deviceStatus[site_id])
      }, 7000);
  });

  // Exit maintenance mode route
  app.post('/api/maintenance/exit', async (req, res) => {
    const list_of_ids = req.body.devices_id;
    const site_id = req.body.site_id;
    maintenance_service(site_id, list_of_ids, MAINTENANCE_EXIT);
    setTimeout(() => {
    device_status_query(site_id);
    }, 1000);
    setTimeout(() => {
      res.json(deviceStatus[site_id])
    }, 7000);
  });

  app.post('/api/device-status', async (req, res) => {
    const { site_id } = req.body;
    device_status_query(site_id);
    setTimeout(() => {
      res.json(deviceStatus[site_id])
      deviceStatus[site_id]={};
    }, 5000);
  })


  app.get('/api/html/:role/:key', (req, res) => {
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




};
