const fs = require("fs");
const path = require("path");
const USER_DATA = path.join(__dirname, "../database/json-data/jsonData.json");
const REQ_DATA = path.join(__dirname, "../database/json-data/requestData.json");

class JsonController {
  fetchSampleData() {
    return { name: "Nuez Technologies" };
  }


  postUserDataToServer =  (user) => {
    try {
      const data =  this.readDatabase(USER_DATA);
  
      const newUser = {
        _id: data.users.length ? data.users[data.users.length - 1]._id + 1 : 1,
        ...user,
      };
      newUser.role='consumer';
      data.users.push(newUser);
      
       this.writeDatabase(USER_DATA,data);
  
      return newUser;
      console.log(`${newUser.name} successfully registered`);
    } catch (error) {
      throw new Error('Failed to post user data: ' + error.message);
    }
  };
  postUserRequestToServer =  (user) => {
    try {
      const data =  this.readDatabase(REQ_DATA);
  
      const newReq = {
        _id: user._id,
        name: user.name,
        'current-role': "consumer",
        'requested-role': "admin",
        'request-status': "pending"
      };
      data.push(newReq);
      
       this.writeDatabase(REQ_DATA,data);
  
      // return newUser;
      console.log(`${newUser.name} successfully added request`);
    } catch (error) {
      throw new Error('Failed to post user request: ' + error.message);
    }
  };

  readDatabase (DATA_FILE)  {
    try {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      throw new Error('Unable to read database: ' + error.message);
    }
  };

  writeDatabase (DATA_FILE,data){
    try {
      const jsonData = JSON.stringify(data, null, 2); 
      fs.writeFileSync(DATA_FILE, jsonData, 'utf8');
    } catch (error) {
      throw new Error('Unable to write to the database: ' + error.message);
    }
  };
  fetchAllUsers(){
    const db=this.readDatabase(USER_DATA);
    return db.users;
  }
  fetchRoleChangeReq(){
    const db=this.readDatabase(REQ_DATA);
    return db;
  }
}

module.exports = new JsonController();
