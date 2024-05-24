import * as client from '../client/client.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('regForm');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = {
            name: document.getElementById('fname').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            role: document.querySelector('input[name="role"]:checked').value
        };

        try {
            const response = await client.postUserDataToServer(formData);
            alert(response.message);

            if (response.success) {
                window.location.href = '/login';
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Error registering user. Please try again.');
        }

        form.reset();
    });
});
