const fs = require("fs");
const path = require("path");
const DATA_FILE = path.join(__dirname, "../database/json-data/jsonData.json");

class JsonController {
  fetchSampleData() {
    return { name: "Nuez Technologies" };
  }

  // readData(callback) {
  //   fs.readFile(DATA_FILE, "utf8", (err, data) => {
  //     if (err) {
  //       callback(err);
  //     } else {
  //       try {
  //         const parsedData = JSON.parse(data);
  //         callback(null, parsedData);
  //       } catch (parseErr) {
  //         callback(parseErr);
  //       }
  //     }
  //   });
  // }

  // writeData(data, callback) {
  //   fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf8", (err) => {
  //     if (err) {
  //       callback(err);
  //     } else {
  //       callback(null);
  //     }
  //   });
  // }

  postUserDataToServer =  (user) => {
    try {
      const data =  this.readDatabase();
  
      const newUser = {
        _id: data.users.length ? data.users[data.users.length - 1]._id + 1 : 1,
        ...user,
      };
  
      data.users.push(newUser);
      
       this.writeDatabase(data);
  
      // return newUser;
      console.log(`${newUser.name} successfully registered`);
    } catch (error) {
      throw new Error('Failed to post user data: ' + error.message);
    }
  };

  readDatabase ()  {
    try {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      throw new Error('Unable to read database: ' + error.message);
    }
  };

  writeDatabase (data){
    try {
      const jsonData = JSON.stringify(data, null, 2); 
      fs.writeFileSync(DATA_FILE, jsonData, 'utf8');
    } catch (error) {
      throw new Error('Unable to write to the database: ' + error.message);
    }
  };
  fetchAllUsers(){
    const db=this.readDatabase();
    return db.users;
}
}

module.exports = new JsonController();
