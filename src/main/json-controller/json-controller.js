const fs = require("fs");
const path = require("path");
const USER_DATA = path.join(__dirname, "../database/json-data/jsonData.json");
const REQ_DATA = path.join(__dirname, "../database/json-data/requestData.json");
const ACCEPTED_LOG = path.join(__dirname, "../database/json-data/approvedReqLog.json");
const REJECTED_LOG = path.join(__dirname, "../database/json-data/deniedReqLog.json");
class JsonController {
  fetchSampleData() {
    return { name: "Nuez Technologies" };
  }
    /////////// DO NOT CHANGE /////////////////////
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
  /////////// DO NOT CHANGE /////////////////////

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
  postUserRequestToServer =  async (user,reqRole) => {
    try {
      const data = await this.readDatabase(REQ_DATA);
      const currRole=user.role;
      // const reqRole=(user.role==="consumer")?"admin":"consumers"
      const newReq = {
        _id: user._id,
        name: user.name,
        // 'current-role': "consumer",
        // 'requested-role': "admin",
        // 'request-status': "pending"
        "currentRole":currRole,
        "requestedRole":reqRole,
        "requestStatus": "pending"
      };
      data.push(newReq);
      
      await this.writeDatabase(REQ_DATA,data);
  
      // return newUser;
      console.log(`${newReq.name} successfully added request`);
    } catch (error) {
      throw new Error('Failed to post user request: ' + error.message);
    }
  };
  ///// FETCH ALL USER DATA FROM THE DATABASE//////
  async fetchAllUsers(){
    const db=await this.readDatabase(USER_DATA);
    return db.users;
  }
  ////// FETCH ALL ROLE CHANGE REQUEST FROM THE DATABASE/////
  async fetchRoleChangeReq(){
    const db=await this.readDatabase(REQ_DATA);
    return db;
  }
  async fetchApprovedLog(){
    const db=await this.readDatabase(ACCEPTED_LOG);
    return db;
  }
  async fetchRejectedLog(){
    const db=await this.readDatabase(REJECTED_LOG);
    return db;
  }


////////  NOT USED CURRENTLY ////////
//// TO DELETE A PARTICULAR USER BY ID FROM THE MAIN DATABASE/////
 async deleteUserById(userId){
    const data =await this.readDatabase(USER_DATA);
    const userIndex=await data.users.findIndex(it=> it._id===userId)
    const deletedUser=await data.users.splice(userIndex,1)[0];
    await this.writeDatabase(USER_DATA,data);
    console.log(`${deletedUser.name} has been deleted successfully`)
    return deletedUser;
    
  }


  async deleteReqByUserId(userId){
    const data =await this.readDatabase(REQ_DATA);
    const userIndex=await data.findIndex(it=> it._id===userId)
    const deletedUser=await data.splice(userIndex,1)[0];
    await this.writeDatabase(REQ_DATA,data);
    console.log(`${deletedUser.name} has been deleted successfully from role req table`)
    return deletedUser;
  }

  async addResponseToLog(user,userData){
    const LOG_DB =(userData.action==="approved") ?ACCEPTED_LOG:REJECTED_LOG;
    try {
      const data = await this.readDatabase(LOG_DB);
      
      const newLog ={
        _id : user._id,
        name : user.name,
        "roleRequested" : user.reqestedRole,
        "actionTaken": userData.action,
        "timeStamp" : userData.time
      }
      data.push(newLog)
       await this.writeDatabase(LOG_DB,data);
  
      // return newUser;
      console.log(`${newLog.name} successfully added request`);
    } catch (error) {
      throw new Error('Failed to post user request: ' + error.message);
    }
  }

  async roleChange(userId){
    const data =await this.readDatabase(USER_DATA);
    const user=await data.users.find( it=> it._id===userId)
    if(user.role==="consumer"){
      user.role="admin"
    }
    else{
      user.role="consumer"
    }
    await this.writeDatabase(USER_DATA,data);
  }

}

module.exports = new JsonController();
