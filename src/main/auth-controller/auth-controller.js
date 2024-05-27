const dbController = require("../db-controller/db-controller");

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
        const user = await dbController.findUserByEmail(email);

        if (!user || user.password !== password) {
            return { success: false, role: 'null', message: 'Invalid email or password' };
        }

        let role = user.role;
        return { success: true, role: role, message: 'Logged In Successfully' };
    }
}

module.exports = new authController();