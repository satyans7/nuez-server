const dbController = require("../db-controller/db-controller");
const authController = require("../auth-controller/auth-controller");
const ntpClient = require('ntp-client');
class Controller {
  async fetchSampleDataFromServer() {
    let data = await dbController.fetchSampleDataFromServer();
    console.log(data);
    return data;
  }

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


  
//isko mt chedna
  async authenticateUser(formData) {
    try {
        let authResult = await authController.authenticateUser(formData);
        console.log("authResult")
        if (authResult.success) {
            if (authResult.route) {
                // Handle special case for reserved emails
                return { success: true, route: authResult.route, message: authResult.message };
            } else {
                let route = `/api/${authResult.role}-dashboard`;
                return { success: true, route: route, message: 'Logged In Successfully' };
            }
        } else {
            return { success: false, route: 'null', message: 'Invalid username or password!!!' };
        }
    } catch (error) {
        return { success: false, route: 'null', message: 'Internal Server Error' };
    }
}
  /////////////////UNUSED/////////////
  async updateProfileOfUser() {
    let data = await dbController.fetchSampleDataFromServer();
    console.log(data);
    return data;
  }
  async deleteUserById(userId) {
    return await dbController.deleteUserById(userId);
  }
  /////////////////UNUSED/////////////

  

  async requestRoleChange(req) {
    let userId = req.body._id;
    // const user = await dbController.fetchUserById(userId);
   
    const reqRole = req.body.reqRole;
    await dbController.requestRoleChange(userId, reqRole);
  }

  async roleChangeResponse(req) {
    const action = req.body.action;
    const userId = req.body._id;
    const delUser = await dbController.deleteReqByUserId(userId);
    const timeStamp = await this.getTimeAndDate();
    console.log(delUser);
    await dbController.addResponseToLog(delUser, req.body,timeStamp);
    if (action === "approved") {
      await dbController.roleChange(userId);
    }
  }

  
  async getTimeAndDate() {
    try {
      const ntpTime = await new Promise((resolve, reject) => {
        ntpClient.getNetworkTime('pool.ntp.org', 123, (err, date) => {
          if (err) {
            reject(err);
          } else {
            resolve(date);
          }
        });
      });
      console.log('Received NTP Date:', ntpTime);
      return ntpTime.toLocaleString();
    } catch (error) {
      console.error('Error fetching time from NTP:', error);
      const localTime = new Date();
      console.log('Using local time:', localTime);
      return localTime.toLocaleString();
    }
  }

  async findUserByEmail(email) {
    // console.log(typeof(email));
    const users = await this.fetchAllUsers()
    // console.log(users);
    for(let userId in  users ){
      // console.log(userId)
      if(users[userId].email===email){
        // console.log("matched")
        return users[userId]
      }
    }
    return {}
  }
  async validateUniquenessOfUserName(username) {
    const user = await this.findUserByEmail(username);
    
    return user=={}
  }
  async fetchAllAdminInfo() {
    let data = await dbController.fetchAllUsers();
    
    const newObject={};
    let ids=Object.keys(data);
    ids.forEach(id => {
      const user = data[id];
      if(user.role==='admin'){
      newObject[id] = {
          name: user.name,
          email: user.email,
          role: user.role 
      };}
  });
    return newObject;
  }
  async fetchAllConsumerInfo(){
    let data = await dbController.fetchAllUsers();
    
    const newObject={};
    let ids=Object.keys(data);
    ids.forEach(id => {
      const user = data[id];
      if(user.role==='consumer'){
      newObject[id] = {
          name: user.name,
          email: user.email,
          role: user.role 
      };}
  });
    return newObject;
  }

  async fetchRoleChangeReq() {
    let data = await dbController.fetchRoleChangeReq();
    const newObject={};
    let ids=Object.keys(data);
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

  async fetchApprovedLog() {
    let data = await dbController.fetchApprovedLog();
    return data;
  }

  async fetchRejectedLog() {
    let data = await dbController.fetchRejectedLog();
    return data;
  }

  async fetchUserById(userId) {
    let data = await dbController.fetchUserById(userId);
    return data;
  }

 
  ///////////TESTING CONTROLLER///////////
  async test (){
    return await this.postUserRequestToServer();
  }


  
  
}

module.exports = new Controller();
