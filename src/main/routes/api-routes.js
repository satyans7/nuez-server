const path = require('path');
const controller = require("../controller/controller.js");

module.exports = function (app) {
  const AEP_SAMPLE = "/api/sample";
  app.get(AEP_SAMPLE, async (req, res) => {
    const data = await controller.fetchSampleDataFromServer();
    console.log(data);
    res.send(data);
  });

  const AEP_TO_REGISTER_A_USER = "/api/user/register";
  const AEP_TO_AUTHENTICATE_A_USER = "/api/user/authenticate";
  const AEP_TO_UPDATE_PROFILE_OF_A_USER = "/api/user/profile/:id";
  const AEP_TO_FETCH_ALL_USERS = "/api/user";
  const AEP_TO_FETCH_USER_BY_ID = "/api/user/:id";
  const AEP_TO_DELETE_A_USER = "/api/user/terminate/:id";
  const AEP_TO_REQUEST_FOR_ROLE_CHANGE = "/api/user/request/:id";
  const AEP_TO_FETCH_ROLE_CHANGE_REQ = "/api/user/role-change-req";
  const ADMINPAGE = path.join(__dirname, '../views/pages', 'admin.html');
  const CONSUMERPAGE = path.join(__dirname, '../views/pages', 'consumer.html');
  const PRIVATE_AEP_TO_ADMINROUTE = "/api/admin-dashboard";
  const PRIVATE_AEP_TO_CONSUMERROUTE = "/api/consumer-dashboard";
  const AEP_FOR_ROLE_CHANGE_RESPONSE = "/api/user/response/:id";

  const AEP_TO_FETCH_APPROVED_LOG = "/api/response/approved";
  const AEP_TO_FETCH_DENIED_LOG = "/api/response/denied";

  app.post(AEP_TO_REGISTER_A_USER, async (req, res) => {
    await controller.registerUser(req, res);
  });

  app.get(AEP_TO_FETCH_ALL_USERS, async (req, res) => {
    const data = await controller.fetchAllUsers();
    res.json(data);
  });

  app.get(AEP_TO_FETCH_ROLE_CHANGE_REQ, async (req, res) => {
    const data = await controller.fetchRoleChangeReq();
    res.json(data);
  });

  app.get(AEP_TO_FETCH_APPROVED_LOG, async (req, res) => {
    const data = await controller.fetchApprovedLog();
    res.json(data);
  });

  app.get(AEP_TO_FETCH_DENIED_LOG, async (req, res) => {
    const data = await controller.fetchRejectedLog();
    res.json(data);
  });

  app.get(AEP_TO_FETCH_USER_BY_ID, async (req, res) => {
    const data = await controller.fetchUserById(req.params.id);
    res.json(data);
  });

  app.post(AEP_TO_AUTHENTICATE_A_USER, async (req, res) => {
    const data = await controller.authenticateUser(req.body);
    if (data.success) {
      return res.json(data);
    } else {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  });

  app.put(AEP_TO_UPDATE_PROFILE_OF_A_USER, async (req, res) => {
    const data = await controller.updateProfileOfUser();
    console.log(data);
    res.send(data);
  });

  app.post(AEP_TO_REQUEST_FOR_ROLE_CHANGE, async (req, res) => {
    console.log("hello");
    await controller.requestRoleChange(req);
    res.sendStatus(200); // Sending a status to indicate success
  });

  app.post(AEP_FOR_ROLE_CHANGE_RESPONSE, async (req, res) => {
    await controller.roleChangeResponse(req);
    res.sendStatus(200); // Sending a status to indicate success
  });

  app.delete(AEP_TO_DELETE_A_USER, async (req, res) => {
    const data = await controller.deleteUserById(req.params.id);
    res.json(data);
  });

  ////////////PROTECTED ROUTES//////////////////
  app.get(PRIVATE_AEP_TO_ADMINROUTE, (req, res) => {
    res.sendFile(ADMINPAGE);
  });

  app.get(PRIVATE_AEP_TO_CONSUMERROUTE, (req, res) => {
    res.sendFile(CONSUMERPAGE);
  });
};
