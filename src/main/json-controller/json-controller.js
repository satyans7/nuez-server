const fs = require("fs");

class JsonController {
  fetchSampleData() {
    return { name: "Nuez Technologies" };
  }
  /////////// DO NOT CHANGE /////////////////////
  readDatabase(DATA_FILE) {
    try {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      throw new Error('Unable to read database: ' + error.message);
    }
  };

  writeDatabase(DATA_FILE, data) {
    try {
      const jsonData = JSON.stringify(data, null, 2);
      fs.writeFileSync(DATA_FILE, jsonData, 'utf8');
    } catch (error) {
      throw new Error('Unable to write to the database: ' + error.message);
    }
  };
}
module.exports = new JsonController();