const AEP_SAMPLE = "/api/sample";
export function getApiToFetchSampleDataFromServer() {
  return AEP_SAMPLE;
}

const AEP_TO_REGISTER_A_USER = "/api/user/register";
const AEP_TO_AUTHENTICATE_A_USER = "/api/user/authenticate";
const AEP_TO_UPDATE_PROFILE_OF_A_USER = "/api/user/profile";
const AEP_TO_FETCH_ALL_USERS = "/api/user";
const AEP_TO_FETCH_USER_BY_ID = "/api/user";
const AEP_TO_PROMOTE_A_USER = "/api/user/promote";
const AEP_TO_DEMOTE_A_USER = "/api/user/demote";
const AEP_TO_REQUEST_FOR_ROLE_CHANGE = "/api/user/request";
const AEP_TO_FETCH_ROLE_CHANGE_REQ = "/api/user/role-change-req";
const AEP_FOR_ROLE_CHANGE_RESPONSE = "/api/user/response";

const AEP_TO_FETCH_APPROVED_LOG = "/api/response/approved";
const AEP_TO_FETCH_DENIED_LOG = "/api/response/denied";

export function getApiToRegisterUser() {
  return AEP_TO_REGISTER_A_USER;
}

export function getApiToAuthenticateUser() {
  return AEP_TO_AUTHENTICATE_A_USER;
}

export function getApiToUpdateProfileOfUser(id) {
  return `${AEP_TO_UPDATE_PROFILE_OF_A_USER}/${id}`;
}

export function getApiToFetchUserDetailsForAll() {
  return AEP_TO_FETCH_ALL_USERS;
}

export function getApiToFetchUserDetailsById(id) {
  return `${AEP_TO_FETCH_USER_BY_ID}/${id}`;
}

export function getApiToPromoteUser(id) {
  return `${AEP_TO_PROMOTE_A_USER}/${id}`;
}

export function getApiToDemoteUser(id) {
  return `${AEP_TO_DEMOTE_A_USER}/${id}`;
}

export function getApiToRequestRoleChange(userId) {
  return `${AEP_TO_REQUEST_FOR_ROLE_CHANGE}/${userId}`;
}

export function getApiToApproveRoleChange(id) {
  return `${AEP_FOR_ROLE_CHANGE_RESPONSE}/${id}`;
}

export function getApiToRejectRoleChange(id) {
  return `${AEP_FOR_ROLE_CHANGE_RESPONSE}/${id}`;
}

export function getApiToRoleChangeRequest() {
  return AEP_TO_FETCH_ROLE_CHANGE_REQ;
}

export function getApiToFetchApprovedLog() {
  return AEP_TO_FETCH_APPROVED_LOG;
}

export function getApiToFetchDeniedLog() {
  return AEP_TO_FETCH_DENIED_LOG;
}


export async function fetchPost(url, data) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  console.log(response)
  return response.json();
}


export async function getDataFromServer(api) {
  try {
    const response = await fetch(api);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

