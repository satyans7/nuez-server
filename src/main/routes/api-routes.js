const controller = require("../controller/controller.js");

module.exports = function (app) {
  const AEP_SAMPLE = "/api/sample";
  app.get(AEP_SAMPLE, (req, res) => {
    const data = controller.fetchSampleDataFromServer();
    console.log(data);
    res.send(data);
  });

  const AEP_TO_REGISTER_A_USER = "/api/user/register";
  const AEP_TO_AUTHENTICATE_A_USER = "/api/user/authenticate";
  const AEP_TO_UPDATE_PROFILE_OF_A_USER = "/api/user/profile/:id";
  const AEP_TO_FETCH_ALL_USERS = "/api/user";
  const AEP_TO_FETCH_USER_BY_ID = "/api/user/:id";
  const AEP_TO_PROMOTE_A_USER = "/api/user/promote/:id";
  const AEP_TO_DEMOTE_A_USER = "/api/user/demote/:id";
  const AEP_TO_REQUEST_PROMOTE_A_USER = "/api/user/request/promote/:id";
  const AEP_TO_REQUEST_DEMOTE_A_USER = "/api/user/request/demote/:id";

  app.post(AEP_TO_REGISTER_A_USER,(req, res) => {
    controller.registerUser(req, res); 
});
  app.post(AEP_TO_AUTHENTICATE_A_USER, (req, res) => {
    const data = controller.authenticateUser();
    console.log(data);
    res.send(data);
  });
  app.put(AEP_TO_UPDATE_PROFILE_OF_A_USER, (req, res) => {
    const data = controller.updateProfileOfUser();
    console.log(data);
    res.send(data);
  });
  app.get(AEP_TO_FETCH_ALL_USERS, (req, res) => {
    const data = controller.fetchAllUsers();
    console.log(data);
    res.send(data);
  });
  app.get(AEP_TO_FETCH_USER_BY_ID, (req, res) => {
    const data = controller.fetchUserById();
    console.log(data);
    res.send(data);
  });
  app.patch(AEP_TO_PROMOTE_A_USER, (req, res) => {
    const data = controller.promoteUser();
    console.log(data);
    res.send(data);
  });
  app.patch(AEP_TO_DEMOTE_A_USER, (req, res) => {
    const data = controller.demoteUser();
    console.log(data);
    res.send(data);
  });
  app.patch(AEP_TO_REQUEST_PROMOTE_A_USER, (req, res) => {
    const data = controller.requestPromoteUser();
    console.log(data);
    res.send(data);
  });
  app.patch(AEP_TO_REQUEST_DEMOTE_A_USER, (req, res) => {
    const data = controller.requestDemoteUser();
    console.log(data);
    res.send(data);
  });
};
