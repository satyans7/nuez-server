const nodemailer = require('nodemailer');
const env= require('dotenv')
env.config()
class mailSenderUtility{
  async mailSender(email,title,body) {
    try {
      // Create a Transporter to send emails
      let transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        service:process.env.MAIL_SERVICE,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        }
      });
      // Send emails to users
      let info = await transporter.sendMail({
        from: process.env.MAIL_USER,
        to: email,
        subject: title,
        html: body,
      });
      console.log("Email info: ", info);
      return info;
    } catch (error) {
      console.log(error.message);
    }
  };


}
module.exports = new mailSenderUtility();