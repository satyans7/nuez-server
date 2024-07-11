const Helper = require("./helper.js");
class passwordAuthController {
    async authenticateUser(formData) {
        const email = formData.email;
        const password = formData.password;

        // Check if the email is reserved
        const isReserved = await this.isEmailReserved(email);
        
        if (isReserved && password === 'password') {
            return { success: true, route: '/superAdmin', message: 'Logged In Successfully as Super Admin' };
        }

        // Fetch the user from the database
        console.log("reached here");
        const user = await this.findUserByEmail(email);
        console.log(user);

        if (!user || user.password !== password) {
            return { success: false, user: "null", role: 'null', message: 'Invalid email or password' };
        }
        let role = user.role;
        return { success: true, user: user, role: role, message: 'Logged In Successfully' };
    }

    async isEmailReserved(email){
        return Helper.isEmailReserved(email);
    }

    async findUserByEmail(email){
        return Helper.findUserByEmail(email);
    }
}

module.exports = new passwordAuthController();