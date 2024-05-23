const fs = require("fs");
const path = require("path");
const DATA_FILE = path.join(__dirname, "../database/json-data/jsonData.json");

class JsonController {
  fetchSampleData() {
    return { name: "Nuez Technologies" };
  }

  readData(callback) {
    fs.readFile(DATA_FILE, "utf8", (err, data) => {
      if (err) {
        callback(err);
      } else {
        try {
          const parsedData = JSON.parse(data);
          callback(null, parsedData);
        } catch (parseErr) {
          callback(parseErr);
        }
      }
    });
  }

  writeData(data, callback) {
    fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf8", (err) => {
      if (err) {
        callback(err);
      } else {
        callback(null);
      }
    });
  }

  postUserDataToServer(user, callback) {
    this.readData((err, data) => {
      if (err) {
        return callback(err);
      }

      try {
        const newUser = {
          _id: data.users.length ? data.users[data.users.length - 1]._id + 1 : 1,
          ...user,
        };
        
        data.users.push(newUser);

        this.writeData(data, (writeErr) => {
          if (writeErr) {
            return callback(writeErr);
          }
          callback(null, newUser);
        });
      } catch (err) {
        callback(err);
      }
    });
  }
}

module.exports = new JsonController();
