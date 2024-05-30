const path = require('path');
const controller = require("../controller/controller.js");

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

  //private
  const PRIVATE_AEP_TO_ADMINROUTE = "/api/admin-dashboard/:id";
  const PRIVATE_AEP_TO_CONSUMERROUTE = "/api/consumer-dashboard/:id";
  const PRIVATE_AEP_TO_SITES = "/api/site-dashboard/:id";

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





  /////////UNUSED ROUTES/////////////////
  app.put(AEP_TO_UPDATE_PROFILE_OF_A_USER, async (req, res) => {
    const data = await controller.updateProfileOfUser();
    console.log(data);
    res.send(data);
  });
  app.delete(AEP_TO_DELETE_A_USER, async (req, res) => {
    const data = await controller.deleteUserById(req.params.id);
    res.json(data);
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



};



