import * as client from "../client/client";

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('regForm');
  
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = {
            name: document.getElementById('fname').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            role: document.querySelector('input[name="role"]:checked').value
        };
    
        client.postUserDataToServer(formData);
        

        form.reset();
    });
});

