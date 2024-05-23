const AEP_SAMPLE = "/api/sample";
export function getApiToFetchSampleDataFromServer() {
  return AEP_SAMPLE;
}

  const AEP_TO_REGISTER_A_USER = "/api/user/register";
  const AEP_TO_AUTHENTICATE_A_USER = "/api/user/authenticate";
  const AEP_TO_UPDATE_PROFILE_OF_A_USER = "/api/user/profile/:id";
  const AEP_TO_FETCH_ALL_USERS = "/api/user";
  const AEP_TO_FETCH_USER_BY_ID = "/api/user/:id";
  const AEP_TO_PROMOTE_A_USER = "/api/user/promote/:id";
  const AEP_TO_DEMOTE_A_USER = "/api/user/demote/:id";
  const AEP_TO_REQUEST_FOR_ROLE_CHANGE = "/api/user/request/:id";
  const AEP_TO_FETCH_ROLE_CHANGE_REQ = "/api/user/role-change-req";


export function getApiToRegisterUser() {
  return AEP_TO_REGISTER_A_USER;
}
export function getApiToAuthenticateUser() {
  return AEP_TO_AUTHENTICATE_A_USER;
}
export function getApiToUpdateProfileOfUser() {
  return AEP_TO_UPDATE_PROFILE_OF_A_USER;
}
export function getApiToFetchUserDetailsForAll() {
  return AEP_TO_FETCH_ALL_USERS;
}
export function getApiToFetchUserDetailsById() {
  return AEP_TO_FETCH_USER_BY_ID;
}
export function getApiToPromoteUser() {
  return AEP_TO_PROMOTE_A_USER;
}
export function getApiToDemoteUser() {
  return AEP_TO_DEMOTE_A_USER;
}

export function getApiToRequestRoleChange() {
  return AEP_TO_REQUEST_FOR_ROLE_CHANGE
}
export function getApiToRoleChangeRequest() {
  return AEP_TO_FETCH_ROLE_CHANGE_REQ ;
}

export async function getDataFromServer(apiEndPoint) {
    return await fetch(apiEndPoint)
      .then((response) => {
        return response.ok
          ? response.json()
          : response.text().then((text) => {
              throw new Error(`[${response.status}] ${text}`);
            });
      })
      .catch((error) => {
        console.error("Error getting data:", error.message);
        return null;
      });
}

export async function fetchPost(AEP_TO_REGISTER_A_USER,formData){
  return await (fetch(AEP_TO_REGISTER_A_USER, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
    
}).then(response => response.json())
.then(data => {
    console.log('Success:', data);
})
.catch((error) => {
    console.error('Error:', error);
}))}

export async function getAllUsersDataFromServer(api){
  try {
    const response = await fetch(api);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }  
}
