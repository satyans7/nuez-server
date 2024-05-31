import * as client from "../client/client.js";
document.addEventListener('DOMContentLoaded',async()=>
    { document.getElementById("sendotp").addEventListener("click",async()=>{
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
    })
    })
    document.addEventListener('DOMContentLoaded',async()=>
        { document.getElementById("verifyotp").addEventListener("click",async()=>{
            const otp = document.getElementById('otp').value;
            const email=document.getElementById('email').value;
            if (otp) {
                console.log(`Verifying OTP: ${otp}`);
                try {
                    const jsonResponse = await client.verifyOTP(email,otp);
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
            } else {
                alert('Please enter the OTP.');
            }
        })
        })