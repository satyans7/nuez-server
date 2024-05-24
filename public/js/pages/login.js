
import * as client from "../client/client.js";
document.addEventListener('DOMContentLoaded',()=>
{
    const form = document.getElementById('loginform');

    form.addEventListener('submit', async(event) => {
        event.preventDefault();

        const logData={
            email: document.getElementById('username').value,
            password: document.getElementById('password').value
        };
        try {
            const response = await client.userLoginDetailsPost(logData);
            const jsonResponse = await response.json();
      
            if (jsonResponse.success) {
              console.log(`Redirecting to ${jsonResponse.route}`);
              // Show a success message
              alert(jsonResponse.message);
              // Redirect to the route specified in the response
              window.location.href = jsonResponse.route;
            } else {
              alert(jsonResponse.message);
            }
          } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
          }
             
        form.reset();

    })
})