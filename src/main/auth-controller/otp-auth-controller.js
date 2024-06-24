const dbController = require("../db-controller/db-controller");
const  mailSenderUtility = require("../utils/mailSender")

class otpAuthController {
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
        return { success: true, user: user, message: 'Logged In Successfully' };
      }
      else return { success: false, user:undefined, message: 'WRONG OTP!!! TRY AGAIN' };
     }
}
module.exports = new otpAuthController();