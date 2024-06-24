const passwordAuthController = require('./password-auth-controller');
const otpAuthController = require('./otp-auth-controller');
const googleAuthController = require("./google-auth-controller")
module.exports = {
    passwordAuthController,
    otpAuthController,
    googleAuthController
};
