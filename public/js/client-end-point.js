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
const AEP_TO_REQUEST_PROMOTE_A_USER = "/api/user/request/promote/:id";
const AEP_TO_REQUEST_DEMOTE_A_USER = "/api/user/request/demote/:id";

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
export function getApiToRequestPromoteUser() {
  return AEP_TO_REQUEST_PROMOTE_A_USER;
}
export function getApiToRequestDemoteUser() {
  return AEP_TO_REQUEST_DEMOTE_A_USER;
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