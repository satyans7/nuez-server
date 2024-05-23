import * as client from "../client/client.js";

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('regForm');
  
    form.addEventListener('submit',async (event) => {
        event.preventDefault();

        const formData = {
            name: document.getElementById('fname').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            role: document.querySelector('input[name="role"]:checked').value
        };
    
        //client.postUserDataToServer(formData);
        try {
            await client.postUserDataToServer(formData);
            console.log('Form submitted successfully');
            // Show success message
            alert('User successfully registered');
            // Redirect to login page after showing the alert
            window.location.href = '/login';
        } catch (error) {
            console.error('Error submitting form:', error);
            // Show error message (optional)
            alert('Error registering user. Please try again.');
        }


        form.reset();
    });
});

