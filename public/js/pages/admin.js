import { userLoginDetailsFetch } from '../client/client.js';

document.addEventListener('DOMContentLoaded', async() =>{
    await userLoginDetailsFetch()
    //console.log(response)
})