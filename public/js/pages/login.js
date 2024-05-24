
import * as client from "../client/client.js";
document.addEventListener('DOMContentLoaded',()=>
{
    const form = document.getElementById('loginform');

    form.addEventListener('submit', async(event) => {
        event.preventDefault();

        const logData={
            username: document.getElementById('username').value,
            password: document.getElementById('password').value
        };
        try {
            const response=await client.userLoginDetailsPost(logData);
            
            alert(response.message);
            // Redirect to login page after showing the alert
            if(response.success)
            window.location.href = response.route;
        } catch (error) {
            console.error('Error submitting form:', error);
            // Show error message (optional)
            alert(error);
        }
        form.reset();

    })
})