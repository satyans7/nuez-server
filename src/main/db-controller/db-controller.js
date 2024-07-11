const jsonController = require("../json-controller/json-controller");


class DbController {

  readDatabase(DATA_FILE) {
    return jsonController.readDatabase(DATA_FILE);
  };

  writeDatabase(DATA_FILE, data) {
    jsonController.writeDatabase(DATA_FILE, data);
  };
  
}


module.exports = new DbController();