import * as client from "../client/client.js";

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("sendotp").addEventListener("click", async () => {
        const email = document.getElementById('email').value;
        if (email) {
            console.log(`Sending OTP to ${email}`);
            try {
                const jsonResponse = await client.generateOTP(email);
                alert(jsonResponse.message);
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            }
        } else {
            alert('Please enter your email.');
        }
    });

    document.getElementById("verifyotp").addEventListener("click", async () => {
        const otp = document.getElementById('otp').value;
        const email = document.getElementById('email').value;
        if (otp) {
            console.log(`Verifying OTP: ${otp}`);
            try {
                const jsonResponse = await client.verifyOTP(email, otp);
                if (jsonResponse.success) {
                    console.log(`Redirecting to ${jsonResponse.route}`);
                    alert(jsonResponse.message);
                    window.location.href = jsonResponse.route;
                } else {
                    alert(jsonResponse.message);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            }
        } else {
            alert('Please enter the OTP.');
        }
    });
});
