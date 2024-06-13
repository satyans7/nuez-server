const path = require('path');
const controller = require("../controller/controller.js");
const fs = require('fs');
const simpleGit = require('simple-git');
const mqtt = require('mqtt');
module.exports = function (app) {
  const AEP_SAMPLE = "/api/sample";
  app.get(AEP_SAMPLE, async (req, res) => {
    const data = await controller.fetchSampleDataFromServer();
    console.log(data);
    res.send(data);
  });


  const ADMINPAGE = path.join(__dirname, '../views/pages', 'admin.html');
  const CONSUMERPAGE = path.join(__dirname, '../views/pages', 'consumer.html');
  const SUPERADMINPAGE = path.join(__dirname, '../views/pages', 'superAdmin.html');
  const SITEPAGE = path.join(__dirname, '../views/pages', 'siteToDevice.html')
  const DEVICEPROFILE=path.join(__dirname, '../views/pages', 'deviceProfile.html');

  //private
  const PRIVATE_AEP_TO_ADMINROUTE = "/api/admin-dashboard/:id";
  const PRIVATE_AEP_TO_CONSUMERROUTE = "/api/consumer-dashboard/:id";
  const PRIVATE_AEP_TO_SITES = "/api/site-dashboard/:id";
  const PRIVATE_AEP_TO_DEVICEPROFILE="/api/device-profile/:id";

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
  const AEP_TO_FETCH_ALL_SITES = '/api/admin/sites';

  const AEP_TO_FETCH_ALL_SITES_TO_DEVICES = "/api/admin/sitetodevice";
  const AEP_TO_FETCH_ALL_DEVICES = '/api/admin/devices';
  
  const AEP_TO_GENERATE_OTP = "/api/generateotp"
  const AEP_TO_VERIFY_OTP ="/api/verifyotp"
  
  const AEP_TO_FETCH_ALL_SITES_TO_CONSUMERS ="/api/admin/sitetoconsumer";
  const AEP_TO_FETCH_CONSUMERS_TO_DEVICES="/api/consumer/consumertodevice";
  

  const AEP_TO_PUT_SITE = "/api/admin/sites/:id";
const AEP_TO_PUT_DEVICE= "/api/admin/devices/:id";

  const AEP_TO_REGISTER_SITE = "/api/admin/registersite/:id"
  const AEP_TO_DEREGISTER_SITE = "/api/admin/deregistersite/:id"
  const AEP_TO_REGISTER_DEVICE = "/api/admin/registerdevice/:id"
  const AEP_TO_DEREGISTER_DEVICE = "/api/admin/deregisterdevice/:id"

  const AEP_TO_REGISTER_CONSUMER = "/api/admin/registerconsumer/:id";
  const AEP_TO_DEREGISTER_CONSUMER = "/api/admin/deregisterconsumer/:id";

  const AEP_TO_REGISTER_CONSUMER_TO_DEVICE_MAPPING="/api/admin/registerconsumertodevice/:id";
const AEP_TO_DEREGISTER_CONSUMER_TO_DEVICE_MAPPING="/api/admin/deregisterconsumertodevice/:id";

const AEP_TO_ASSIGN_AN_EXISTING_DEVICE_TO_A_CONSUMER="/api/admin/assigndevicetoconsumer/:id";
 const AEP_TO_POST_DEVICE="/api/admin/newdevice/:id";
const AEP_TO_SYNC_FIRMWARE_DATA ="/api/sync-firmware"
  ////////REGISTERING A USER///////
  app.post(AEP_TO_REGISTER_A_USER, async (req, res) => {
    // console.log("registering")
    await controller.registerUser(req, res);
  });
  ////////LOGIN A USER / AUTHENTICATE/////////
  app.post(AEP_TO_AUTHENTICATE_A_USER, async (req, res) => {
    const data = await controller.authenticateUser(req.body);
    if (data.success) {
      return res.json(data);
    } else {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
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
    console.log("hello");
    await controller.requestRoleChange(req);
    res.sendStatus(200); // Sending a status to indicate success
  });
  //////////////SEND THE RESPONSE FOR A REQUEST////////////////////
  app.post(AEP_FOR_ROLE_CHANGE_RESPONSE, async (req, res) => {
    await controller.roleChangeResponse(req);
    res.sendStatus(200); // Sending a status to indicate success
  });



  ////////////PROTECTED ROUTES FOR PAGES RENDERING//////////////////
  app.get(PRIVATE_AEP_TO_ADMINROUTE, (req, res) => {
    res.sendFile(ADMINPAGE);
  });

  app.get(PRIVATE_AEP_TO_CONSUMERROUTE, (req, res) => {
    res.sendFile(CONSUMERPAGE);
  });

  app.get('/superAdmin.html', (req, res) => {
    res.sendFile(SUPERADMINPAGE);
  });

  app.get(PRIVATE_AEP_TO_SITES, (req, res) => {
    res.sendFile(SITEPAGE)
  })

  app.get(PRIVATE_AEP_TO_DEVICEPROFILE,(req,res)=> {
    res.sendFile(DEVICEPROFILE)
  });

  // LOGIN VIA OTP 
  app.post(AEP_TO_GENERATE_OTP, async (req, res) => {
    const email=await controller.OTPGenerationAndStorage(req.body.email);
    return res.status(200).json({message:`Otp has been sent to ${email} successfully!!!`})
  });

  app.post(AEP_TO_VERIFY_OTP, async (req, res) => {
    const data =await controller.OTPVerification(req.body.email,req.body.otp );
    if (data.success) {
      return res.status(200).json(data);
    } else {
      return res.status(401).json({ message: 'Wrong OTP !!! Try Again' });
    }
  });

  ///////////TESTING ROUTES////////////////
  app.post("/test-url", async (req, res) => {
    let data = await controller.test();
    res.json(data);
  })


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
      res.status(500).send('Internal Server Error');
    }
  });


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
      res.status(500).send('Internal Server Error');
    }
  });

  //consumer to device mapping
  app.get(AEP_TO_FETCH_CONSUMERS_TO_DEVICES, async (req, res) => {
    try {
      const data = await controller.fetchAllConsumerToDevice();
      res.json(data);
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
  });

  app.get(AEP_TO_FETCH_ALL_SITES_TO_CONSUMERS, async(req,res)=>{
    try{
      const data =await controller.fetchAllSiteToConsumer();
      res.json(data);
    } catch (error){
      res.status(500).send('Internal Server Error');
    }
  });




  app.put(AEP_TO_PUT_SITE,async(req,res)=>{
    await controller.putSite(req,res);
  });



  app.put(AEP_TO_PUT_DEVICE,async(req,res)=>{
    await controller.putDevice(req,res);
  });

  app.post(AEP_TO_REGISTER_SITE, async(req, res) =>{
    await controller.registerSite(req, res);
  })
  app.delete(AEP_TO_DEREGISTER_SITE, async (req, res) => {
    await controller.deregisterSite(req, res);
  })

  app.post(AEP_TO_REGISTER_DEVICE, async (req, res) => {
    await controller.registerDevice(req, res);
  })

  app.delete(AEP_TO_DEREGISTER_DEVICE, async(req, res) =>{
    await controller.deregisterDevice(req, res);
  })


  app.post(AEP_TO_REGISTER_CONSUMER, async (req, res) => {
    await controller.registerConsumer(req, res);
  })

  app.delete(AEP_TO_DEREGISTER_CONSUMER, async(req, res) =>{
    await controller.deregisterConsumer(req, res);
  })

  app.post(AEP_TO_REGISTER_CONSUMER_TO_DEVICE_MAPPING, async(req, res) =>{
    await controller.registerConsumerToDeviceMapping(req, res);
  })

  app.delete(AEP_TO_DEREGISTER_CONSUMER_TO_DEVICE_MAPPING, async(req, res) =>{
    await controller.deregisterConsumerToDeviceMapping(req, res);
  })

  app.patch(AEP_TO_ASSIGN_AN_EXISTING_DEVICE_TO_A_CONSUMER,async(req,res)=>{
    await controller.AssignDevicetoConsumer(req,res);
  });

  app.post(AEP_TO_POST_DEVICE,async(req,res)=>{
    await controller.postDevice(req,res);
  });


  const localRepoPath = path.join(__dirname ,'../local-repo');
  const githubRepoUrl = 'https://github.com/priyansu1703/testFile';
  const updateRepo = async () => {
    const git = simpleGit();
  
    if (!fs.existsSync(localRepoPath)) {
      // Clone the repository if it doesn't exist
      console.log('Cloning the repository...');
      await git.clone(githubRepoUrl, localRepoPath);
    } else {
      // Pull the latest changes if the repository exists
      console.log('Pulling the latest changes...');
      await git.cwd(localRepoPath);
      await git.pull();
    }
  };
  
  // Zip the folder
  const zipFolder = (source, out) => {
    const archive = archiver('zip', { zlib: { level: 9 } });
    const stream = fs.createWriteStream(out);
  
    return new Promise((resolve, reject) => {
      archive
        .directory(source, false)
        .on('error', err => reject(err))
        .pipe(stream);
  
      stream.on('close', () => resolve());
      archive.finalize();
    });
  };
  
  // Define a route for the button click to update the repository
  app.get(AEP_TO_SYNC_FIRMWARE_DATA, async (req, res) => {
    try {
      await updateRepo();
      res.send('Repository updated successfully!');
    } catch (error) {
      console.error('Error updating repository:', error);
      res.status(500).send('Error updating repository');
    }
  });
  
  const client = mqtt.connect('mqtt://localhost', {
    port: 1883,
    username: 'nuez',
    password: 'emqx@nuez'
  });
  
  // Subscribe to the firmware topic
  const firmwareTopic = 'firmware';
  client.on('connect', () => {
    console.log('Connected to MQTT broker');
    client.subscribe(firmwareTopic, (err) => {
      if (err) {
        console.error(`Failed to subscribe to ${firmwareTopic}:`, err);
      } else {
        console.log(`Subscribed to ${firmwareTopic}`);
      }
    });
  });
  
  client.on('message', (topic, message) => {
    if (topic === firmwareTopic) {
      console.log(`Received message from ${firmwareTopic}:`, message.toString());
    }
  });
  
  // Route to publish firmware version
  app.get('/sendFirmware', (req, res) => {
    const firmwareFilePath = path.join(__dirname, 'local-repo', 'firmware.txt');
    fs.readFile(firmwareFilePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Failed to read firmware.txt:', err);
        res.status(500).send('Failed to read firmware version.');
        return;
      }
  
      client.publish(firmwareTopic, data, (err) => {
        if (err) {
          console.error('Failed to publish firmware version:', err);
          res.status(500).send('Failed to publish firmware version.');
          return;
        }
  
        res.send('Firmware version sent successfully.');
      });
    });
    
  });
  const filePath=path.join(__dirname ,'../local-repo/ota2.ino.bin')

  app.get('/send-file', async (req, res) => {
    try {
      // Read the binary file
      fs.readFile(filePath, async (err, fileContent) => {
        if (err) {
          console.error('Error reading file:', err);
          res.status(500).send('Error reading file');
          return;
        }
  
        // Convert the data to a Blob
        const blob = new Blob([fileContent], { type: 'application/octet-stream' });
  
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename=${path.basename(filePath)}`);
  
        // Convert Blob to ArrayBuffer synchronously using await
        try {
          const buffer = await blob.arrayBuffer();
          res.send(Buffer.from(buffer));
        } catch (error) {
          console.error('Error sending file:', error);
          res.status(500).send('Error sending file');
        }
      });
    } catch (error) {
      console.error('Error sending file:', error);
      res.status(500).send('Error sending file');
    }
  });

  app.post('/publish-message/:site_id', async (req, res) => {
    const site_id = req.params.site_id; // Correctly access site_id from req.params
    console.log(site_id)
    if (!site_id) {
        return res.status(400).json({ error: 'Site ID is required' });
    }

    try {
        // Publish the message to the MQTT topic
        client.publish(site_id, 'hi');
        res.status(200).json({ message: 'Message published successfully' });
    } catch (error) {
        console.error('Error publishing message:', error);
        res.status(500).json({ error: 'Failed to publish message' });
    }
});

app.post('/version', async (req, res) => {
  try {
    const deviceVersions = req.body;

    // Read the JSON file containing device data
    const filePath=path.join(__dirname ,'../database/json-data/deviceToProfile.json')// Update the path to your JSON file
    const rawData = fs.readFileSync(filePath);
    const deviceData = JSON.parse(rawData);
    
    // Update the version of each device
    deviceVersions.forEach(({ device_id, version }) => {
      if (deviceData.hasOwnProperty(device_id)) {
        deviceData[device_id].version = version;
      }
    });

    // Write the updated device data back to the JSON file
    fs.writeFileSync(filePath, JSON.stringify(deviceData, null, 2));

    console.log('Device versions updated successfully');
    res.status(200).json({ message: 'Device versions updated successfully' });
  } catch (error) {
    console.error('Error updating device versions:', error);
    res.status(500).json({ error: 'Failed to update device versions' });
  }
});


app.post('/intimate-all', async (req, res) => {
  try {
      const { message } = req.body;

      // Publish the message to the "site_1/intimate" topic
      client.publish('site_1/intimate', message);

      res.status(200).json({ message: 'Intimate message sent to all devices' });
  } catch (error) {
      console.error('Error intimating all devices:', error);
      res.status(500).json({ error: 'Failed to intimate all devices' });
  }
});


app.post('/intimate-all-sites', (req, res) => {
  const { message } = req.body;

  if (!message) {
      return res.status(400).json({ error: 'Message is required' });
  }

  try {
      client.publish('firmware', message, (err) => {
          if (err) {
              console.error('Error publishing message:', err);
              return res.status(500).json({ error: 'Failed to intimate all sites' });
          }

          console.log('Intimate message sent to all sites');
          res.status(200).json({ message: 'Intimate message sent to all sites' });
      });
  } catch (error) {
      console.error('Error intimating all devices:', error);
      res.status(500).json({ error: 'Failed to intimate all sites' });
  }
});

};








