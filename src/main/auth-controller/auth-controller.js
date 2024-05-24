const dbController = require("../db-controller/db-controller");
class authController {
    authenticateUser(formData){
        
        const email = formData.email;
        const password=formData.password;
        const user = dbController.findUserByEmail(email);
        let role =user.role;
        if (!user || user.password!==password) {
            return {success:false,role:"null"};
        }
        else return {success:true,role:role};
    };
}
module.exports = new authController();
