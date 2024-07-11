const dbController = require("../db-controller/db-controller.js");
const path=require('path');
const RESERVED_EMAILS = path.join(__dirname, "../database/reserved/reserved.json");
const USER_DATA = path.join(__dirname, "../database/json-data/jsonData.json");
const OTPEMAIL = path.join(__dirname, "../database/json-data/otp-email.json");
class Helper {
  async isEmailReserved(email) {
    try {
      const reservedData = await dbController.readDatabase(RESERVED_EMAILS);
      const reservedEmails = reservedData.reserved_emails;
      return reservedEmails.includes(email);
    } catch (error) {
      throw new Error('Failed to check if email is reserved: ' + error.message);
    }
  }

  async findUserByEmail(email) {
    try {
      const users = await this.fetchAllUsers();
      for (let userId in users) {
        if (users[userId].email === email) {
          let newobj = users[userId];
          newobj["_id"] = userId;
          return newobj;
        }
      }
      return {};
    } catch (error) {
      throw new Error('Failed to find user by email: ' + error.message);
    }
  }
  async findOTPByEmail(email) {
    const data = await dbController.readDatabase(OTPEMAIL);
    return await data[email];
  }

  async fetchAllUsers() {
    const db = await dbController.readDatabase(USER_DATA);
    return db;
  }
}

module.exports = new Helper();
