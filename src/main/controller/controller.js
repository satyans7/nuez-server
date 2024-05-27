const dbController = require("../db-controller/db-controller");
const authController = require("../auth-controller/auth-controller");

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
        const newUser = await dbController.postUserDataToServer(req.body);
        console.log('New user registered:', newUser);
  
        // Additional handling for admin role
        if (req.body.role === 'admin') {
          await dbController.postUserRequestToServer(newUser, req.body.role);
        }
  
        return res.status(201).json({ success: true, message: 'Successfully registered' });
      }
    } catch (error) {
      console.error('Error in registerUser:', error.message);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }


  async validateUniquenessOfUserName(username) {
    const user = await dbController.findUserByEmail(username);
    return user !== undefined; 
  }
//isko mt chedna
  async authenticateUser(formData) {
    try {
        let authResult = await authController.authenticateUser(formData);
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

  async updateProfileOfUser() {
    let data = await dbController.fetchSampleDataFromServer();
    console.log(data);
    return data;
  }

  async fetchAllUsers() {
    let data = await dbController.fetchAllUsers();
    return data;
  }

  async fetchRoleChangeReq() {
    let data = await dbController.fetchRoleChangeReq();
    return data;
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

  async promoteUser() {
    let data = await dbController.fetchSampleDataFromServer();
    console.log(data);
    return data;
  }

  async requestRoleChange(req) {
    let userId = req.body._id;
    const user = await dbController.fetchUserById(userId);
    const reqRole = req.body.reqRole;
    await dbController.requestRoleChange(user, reqRole);
  }

  async roleChangeResponse(req) {
    const action = req.body.action;
    const userId = req.body._id;
    const user = await dbController.deleteReqByUserId(userId);
    console.log(user);
    await dbController.addResponseToLog(user, req.body);
    if (action === "approved") {
      await dbController.roleChange(userId);
    }
  }

  async deleteUserById(userId) {
    return await dbController.deleteUserById(userId);
  }
}

module.exports = new Controller();
