const fs = require('fs');
const path = require('path');
const DATA_FILE = path.join(__dirname, '../database/json-data/jsonData.json');
class JsonController {
  fetchSampleData() {
    return { name: "Nuez Technologies" };
  }
  readAllData(callback) {
    fs.readFile(DATA_FILE, "utf8", (err, data) => {
      if (err) {
        callback(err);
      } else {
        callback(null, JSON.parse(data));
      }
    });
  }
  writeData(data, callback){
    fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf8", (err) => {
      if (err) {
        callback(err);
      } else {
        callback(null);
      }
    });
  };

  postUserData(AEP_TO_REGISTER_A_USER) {
    app.post(AEP_TO_REGISTER_A_USER, (req, res) => {
      this.readData((err, data) => {
        if (err) {
          res.status(500).send({ error: "Failed to read data" });
        } else {
          const newUser = {
            _id: data.users.length
              ? data.users[data.users.length - 1]._id + 1
              : 1,
            ...req.body,
          };
          data.users.push(newUser);
          this.writeData(data, (err) => {
            if (err) {
              res.status(500).send({ error: "Failed to write data" });
            } else {
              res.status(201).send(newUser);
            }
          });
        }
      });
    });
  }
}
module.exports = new JsonController();
