const otpGenerator = require('otp-generator')

class otpGeneratorUtility{
    generateOTP() {
        const otp = otpGenerator.generate(6, {
          digits: true, alphabets: false, upperCase: false, specialChars: false
        });
        return otp;
      }
}
module.exports = new otpGeneratorUtility();