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
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('google').addEventListener('click', function(event) {
        window.location.href='/auth/google'
    })
});

document.addEventListener('DOMContentLoaded', function() {
    // Fetch user data from the server
    fetch('/api/fetchDataFromGoogle')
      .then(response => response.json())
      .then(user => {
        // Populate the form fields with user data
        document.getElementById('fname').value = user.name || '';
        document.getElementById('email').value = user.email || '';
      })
      .catch(error => console.error('Error fetching user data:', error));
  });
