const mailSender = require('../utils/mailSender');
const dbController = require("../db-controller/db-controller");
const  mailSenderUtility = require("../utils/mailSender")

class authController {
    async authenticateUser(formData) {
        const email = formData.email;
        const password = formData.password;

        // Check if the email is reserved
        const isReserved = await dbController.isEmailReserved(email);

        if (isReserved && password === 'password') {
            return { success: true, route: '/superAdmin.html', message: 'Logged In Successfully as Super Admin' };
        }

        // Fetch the user from the database
        console.log("reached here")
        const user = await dbController.findUserByEmail(email);
        console.log(user);

        if (user=={} || user.password !== password) {
            return { success: false, role: 'null', message: 'Invalid email or password' };
        }

        let role = user.role;
        return { success: true, role: role, message: 'Logged In Successfully' };
    }
    async  sendVerificationEmail(email, otp) {
        try {
          const mailResponse = await mailSenderUtility.mailSender(
            email,
            "Verification Email",
            `<h1>Please confirm your OTP</h1>
             <p>Here is your OTP code: ${otp}</p>`
          );
          console.log("Email sent successfully: ", mailResponse);
        } catch (error) {
          console.log("Error occurred while sending email: ", error);
          throw error;
        }
      }
    async verifyOTP(email,providedotp){
      const otp = await dbController.findOTPByEmail(email)
      if(otp===providedotp){
        const user = await dbController.findUserByEmail(email);
        return { success: true, role: user.role, message: 'Logged In Successfully' };
      }
      else return { success: false, role: "null", message: 'WRONG OTP!!! TRY AGAIN' };
     }
}
module.exports = new authController();