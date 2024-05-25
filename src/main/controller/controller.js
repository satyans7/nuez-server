const dbController = require("../db-controller/db-controller");
const authController = require("../auth-controller/auth-controller")
class Controller {
  fetchSampleDataFromServer() {
    let data = dbController.fetchSampleDataFromServer();
    console.log(data);
    return data;
  }


  registerUser(req, res) {
    try {
      const email = req.body.email;
  
      // Validate email uniqueness
      const isUnique = this.validateUniquenessOfUserName(email);
  
      if (isUnique) {
        return res.status(400).json({ success: false, message: 'Username already exists' });
      } else {
        // Register the new user
        const newUser = dbController.postUserDataToServer(req.body);
        console.log('New user registered:', newUser);
  
        // Additional handling for admin role
        if (req.body.role === 'admin') {
          dbController.postUserRequestToServer(newUser, req.body.role);
        }
  
        return res.status(201).json({ success: true, message: 'Successfully registered' });
      }
    } catch (error) {
      console.error('Error in registerUser:', error.message);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
  
  validateUniquenessOfUserName(username){
    const user=dbController.findUserByEmail(username);
    return user !== undefined; 
  }
  authenticateUser(formData) {
    try{
    let authResult =  authController.authenticateUser(formData);
       if (authResult.success) {
        let route = `/api/${authResult.role}-dashboard`
         return {success:true,route:route,message:`Logged In Successful`}
      } else {
        return {success:false,route:"null",message:"Invalid username or password!!!"};
      }
    } 
    catch (error) {
      
      return {success:false,route:'null',message:"Internal Server Error"};
    }
  };
  updateProfileOfUser() {
    let data = dbController.fetchSampleDataFromServer();
    console.log(data);
    return data;
  }
  fetchAllUsers() {
    let data = dbController.fetchAllUsers();
      // console.log(data);
      return data;
  }
  fetchRoleChangeReq() {
    let data = dbController.fetchRoleChangeReq();
      // console.log(data);
      return data;
  }
  fetchApprovedLog() {
    let data = dbController.fetchApprovedLog();
      // console.log(data);
      return data;
  }
  fetchRejectedLog() {
    let data = dbController.fetchRejectedLog();
      // console.log(data);
      return data;
  }



  fetchUserById(userId) {
    let data = dbController.fetchUserById(userId);
    // console.log(data);
    return data;
  }
  promoteUser() {
    let data = dbController.fetchSampleDataFromServer();
    console.log(data);
    return data;
  }
  requestRoleChange(req) {
    let userId=req.body._id;
    // console.log(userId);
    const user=dbController.fetchUserById(userId);
    // console.log(user);
    const reqRole=req.body.reqRole;
    // console.log(reqRole)
    dbController.requestRoleChange(user,reqRole)
    // console.log(data);
    // return data;
  }
  roleChangeResponse(req){
    const action= req.body.action;
    const userId= req.body._id;
    const user= dbController.deleteReqByUserId(userId);
    console.log(user);
    dbController.addResponseToLog(user,req.body);
    if(action==="approved"){
      dbController.roleChange(userId);
    }
    
  }






  deleteUserById(userId){
    return dbController.deleteUserById(userId);
  }
  


}
module.exports = new Controller();
