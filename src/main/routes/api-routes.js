const path = require('path')
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
  // const AEP_TO_PROMOTE_A_USER = "/api/user/promote/:id";
  // const AEP_TO_DEMOTE_A_USER = "/api/user/demote/:id";
  const AEP_TO_DELETE_A_USER = "/api/user/terminate/:id";
  const AEP_TO_REQUEST_FOR_ROLE_CHANGE = "/api/user/request/:id";
  const AEP_TO_FETCH_ROLE_CHANGE_REQ = "/api/user/role-change-req";
  const ADMINPAGE=path.join(__dirname, '../views/pages', 'admin.html');
    const CONSUMERPAGE=path.join(__dirname, '../views/pages', 'consumer.html');
    const PRIVATE_AEP_TO_ADMINROUTE="/api/admin-dashboard"
    const PRIVATE_AEP_TO_CONSUMERROUTE="/api/consumer-dashboard"
  const AEP_FOR_ROLE_CHANGE_RESPONSE = "/api/user/response/:id";


  app.post(AEP_TO_REGISTER_A_USER,(req, res) => {
    return controller.registerUser(req, res); 
  });
  app.get(AEP_TO_FETCH_ALL_USERS, (req, res) => {
    const data = controller.fetchAllUsers();
    // console.log(data);
    res.json(data);
  });
  app.get(AEP_TO_FETCH_ROLE_CHANGE_REQ , (req, res) => {
    const data = controller.fetchRoleChangeReq();
    // console.log(data);
    res.json(data);
  });
  
  app.get(AEP_TO_FETCH_USER_BY_ID, (req, res) => {
    const data = controller.fetchUserById(req.params.id);
    // console.log(req.params.id);
    res.json(data);
  });
  


/////
app.post(AEP_TO_AUTHENTICATE_A_USER, (req, res) => {
    const data = controller.authenticateUser(req.body);
    if(data.success){
          return res.json(data);
    }
    else return res.status(401).json({ message: 'Invalid email or password' })
});
/////

  app.put(AEP_TO_UPDATE_PROFILE_OF_A_USER, (req, res) => {
    const data = controller.updateProfileOfUser();
    console.log(data);
    res.send(data);
  });


  // app.patch(AEP_TO_PROMOTE_A_USER, (req, res) => {
  //   const data = controller.promoteUser();
  //   console.log(data);
  //   res.send(data);
  // });
  // app.patch(AEP_TO_DEMOTE_A_USER, (req, res) => {
  //   const data = controller.demoteUser();
  //   console.log(data);
  //   res.send(data);
  // });


  app.post(AEP_TO_REQUEST_FOR_ROLE_CHANGE, (req, res) => {
    const data = controller.requestRoleChange(req);
    // console.log(data);
    // res.send(data);
  });
  app.post(AEP_FOR_ROLE_CHANGE_RESPONSE, (req, res) => {
    const data = controller.roleChangeResponse(req);
    // console.log(data);
    // res.send(data);
  });
  

  app.delete(AEP_TO_DELETE_A_USER, (req, res) => {
    const data = controller.deleteUserById(req.params.id)
    res.json(data);
    // res.send(data);

  });

  ////////////PROTECTED ROUTES//////////////////
app.get(PRIVATE_AEP_TO_ADMINROUTE,(req,res)=>{
    res.sendFile(ADMINPAGE);
    })
    app.get(PRIVATE_AEP_TO_CONSUMERROUTE,(req,res)=>{
    res.sendFile(CONSUMERPAGE);
    })
};





