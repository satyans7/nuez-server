const AEP_SAMPLE = "/api/sample";
export function getApiToFetchSampleDataFromServer() {
  return AEP_SAMPLE;
}

const AEP_TO_REGISTER_A_USER = "/api/user/register";
const AEP_TO_AUTHENTICATE_A_USER = "/api/user/authenticate";
const AEP_TO_UPDATE_PROFILE_OF_A_USER = "/api/user/profile";
const AEP_TO_FETCH_USER_BY_ID = "/api/user";
const AEP_TO_REQUEST_FOR_ROLE_CHANGE = "/api/user/request";
const AEP_TO_FETCH_ROLE_CHANGE_REQ = "/api/user/role-change-req";
const AEP_FOR_ROLE_CHANGE_RESPONSE = "/api/user/response";
const AEP_TO_FETCH_ALL_CONSUMERS = "/api/consumer";
const AEP_TO_FETCH_ALL_ADMINS = "/api/admin";
const AEP_TO_FETCH_APPROVED_LOG = "/api/response/approved";
const AEP_TO_FETCH_DENIED_LOG = "/api/response/denied";
const AEP_TO_DELETE_A_USER = "/api/user/terminate/:id";
const AEP_TO_GENERATE_OTP="/api/generateotp";
const AEP_TO_VERIFY_OTP ="/api/verifyotp"

/// 

const AEP_TO_FETCH_ALL_ADMINS_TO_SITES = "/api/admin/admintosite";
const AEP_TO_FETCH_ALL_SITES = "/api/admin/sites"
const AEP_TO_FETCH_SITE_DATA = "/api/site"

const AEP_TO_FETCH_ALL_SITES_TO_DEVICES = "/api/admin/sitetodevice";
const AEP_TO_FETCH_ALL_SITES_TO_CONSUMERS = "/api/admin/sitetoconsumer";
const AEP_TO_FETCH_ALL_DEVICES = '/api/admin/devices';
const AEP_TO_FETCH_DEVICE_DATA = "/api/device"

const AEP_TO_FETCH_CONSUMERS_TO_DEVICES = "/api/consumer/consumertodevice";

const AEP_TO_PUT_SITE = "/api/admin/sites";
const AEP_TO_PUT_DEVICE= "/api/admin/devices";


const AEP_TO_REGISTER_SITE = "/api/admin/registersite"
const AEP_TO_DEREGISTER_SITE = "/api/admin/deregistersite"
const AEP_TO_REGISTER_DEVICE = "/api/admin/registerdevice"

//deregister
const AEP_TO_DELETE_SITE_DEVICE_MAPPING = "/api/admin/deregisterdevice";

const AEP_TO_REGISTER_CONSUMER_TO_DEVICE_MAPPING="/api/admin/registerconsumertodevice";
const AEP_TO_DEREGISTER_CONSUMER_TO_DEVICE_MAPPING="/api/admin/deregisterconsumertodevice";

const AEP_TO_REGISTER_CONSUMER = "/api/admin/registerconsumer";
const AEP_TO_DEREGISTER_CONSUMER = "/api/admin/deregisterconsumer";

//Assign a device to user
const AEP_TO_ASSIGN_AN_EXISTING_DEVICE_TO_A_CONSUMER="/api/admin/assigndevicetoconsumer";
const AEP_TO_POST_DEVICE="/api/admin/newdevice";

const AEP_TO_SYNC_FIRMWARE_DATA ="/api/sync-firmware"
const AEP_TO_SYNC_SOURCECODE = "/api/sync-sourcecode";
const AEP_TO_SYNC_PI_SOURCECODE = "/api/sync-pi-sourcecode";
const AEP_TO_SEND_FIRMWARE ="/send-firmware"

//Maintenance
const AEP_TO_GET_DEVICE_STATUS = "/api/device-status"
const AEP_TO_ENTER_MAINTENANCE = "/api/maintenance/enter"
const AEP_TO_EXIT_MAINTENANCE = "/api/maintenance/exit"


//Site level source code sync
const AEP_TO_SYNC_PI_SOURCECODE_FOR_PARTICULAR_SITE = "/api/sync-pi-sourcecode/";
export function getApiToRegisterUser() {
  return AEP_TO_REGISTER_A_USER;
}

export function getApiToAuthenticateUser() {
  return AEP_TO_AUTHENTICATE_A_USER;
}

export function getApiToUpdateProfileOfUser(id) {
  return `${AEP_TO_UPDATE_PROFILE_OF_A_USER}/${id}`;
}

export function getApiToFetchConsumerDetailsForAll() {
  return AEP_TO_FETCH_ALL_CONSUMERS;
}

export function getApiToFetchAdminDetailsForAll() {
  return AEP_TO_FETCH_ALL_ADMINS;
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

export function getApiToGenerateOTP() {
  return AEP_TO_GENERATE_OTP;
}
export function getApiToVerifyOTP() {
  return AEP_TO_VERIFY_OTP;
}

export function getApiToUpdateSiteData(id){
  return `${AEP_TO_PUT_SITE}/${id}`;
}

export function getApiToPutDevice(id){
  return `${AEP_TO_PUT_DEVICE}/${id}`;
}

export function getApiToPostDevice(id){
  return `${AEP_TO_POST_DEVICE}/${id}`;
}


//ADMIN PAGE ADMIN_TO_SITE_MAPPING
export function getApiToFetchAdminSiteMapping() {
  return AEP_TO_FETCH_ALL_ADMINS_TO_SITES;
}

export function getApitoFetchAllSitesData() {
  return AEP_TO_FETCH_ALL_SITES;
}

export function getApitoFetchSiteData(id) {
  return `${AEP_TO_FETCH_SITE_DATA}/${id}`;
}


// SITE DEVICE PAGE
export function getApitoFetchAllDevicesData() {
  return AEP_TO_FETCH_ALL_DEVICES;
}
export function getApitoFetchDeviceData(id) {
  return `${AEP_TO_FETCH_DEVICE_DATA}/${id}`;
}

export function getApiToFetchSiteDeviceMapping() {
  return AEP_TO_FETCH_ALL_SITES_TO_DEVICES;  //MAPPING SITE->DEVICE
}

export function getApiToFetchSiteConsumerMapping() {
  return AEP_TO_FETCH_ALL_SITES_TO_CONSUMERS;
}

export function getApiToFetchConsumerDeviceMapping() {
  return AEP_TO_FETCH_CONSUMERS_TO_DEVICES;  //MAPPING CONSUMER->DEVICE
}

export function getApiToFetchSitesUnderAdmin(id){
  return `/api/admin/allsites/${id}`;
}

export function getApiToFetchDevicesUnderSite(id){
  return `/api/admin/alldevices/${id}`;
}
export function getApiToFetchConsumersUnderSite(id){
  return `/api/admin/allconsumers/${id}`;
}

//site source code sync
export function getApiToSyncSiteSourceCode() {
  return AEP_TO_SYNC_PI_SOURCECODE_FOR_PARTICULAR_SITE;
}
//delete a device
export function getApiToDeleteSiteDeviceMapping(deviceId) {
  return `${AEP_TO_DELETE_SITE_DEVICE_MAPPING}/${deviceId}`;
}


export function getApiToRegisterSite(id){
  return  `${AEP_TO_REGISTER_SITE}/${id}`;
}

export function getApiToRegisterDevice(id)
{
  return  `${AEP_TO_REGISTER_DEVICE}/${id}`;
}

export function getApiToDeregisterSite(id){
  return `${AEP_TO_DEREGISTER_SITE}/${id}`;
}


export function getApiToRegisterConsumerDeviceMapping(id){
  return `${AEP_TO_REGISTER_CONSUMER_TO_DEVICE_MAPPING}/${id}`;
}

export function getApiToDeregisterConsumerDeviceMapping(id){
  return `${AEP_TO_DEREGISTER_CONSUMER_TO_DEVICE_MAPPING}/${id}`;
}


export function getApiToRegisterConsumer(id)
{
  return  `${AEP_TO_REGISTER_CONSUMER}/${id}`;
}

export function getApiToDeregisterConsumer(id){
  return `${AEP_TO_DEREGISTER_CONSUMER}/${id}`;
}

export function getApiToAssignDeviceToConsumer(id)
{
  return `${AEP_TO_ASSIGN_AN_EXISTING_DEVICE_TO_A_CONSUMER}/${id}`;
}
export function getApiToSyncFirmware() {
  return AEP_TO_SYNC_FIRMWARE_DATA; 
}
export function getApiToSyncSourceCode() {
  return AEP_TO_SYNC_SOURCECODE; 
}
export function getApiToSyncPiSourceCode() {
  return AEP_TO_SYNC_PI_SOURCECODE; 
}

export function getApiToSendFirmwareToSites() {
  return AEP_TO_SEND_FIRMWARE; 
}

export function getApiTogetDeviceStatus(){
  return AEP_TO_GET_DEVICE_STATUS;
}

export function getApiToEnterMaintenance(){
  return AEP_TO_ENTER_MAINTENANCE;
}

export function getApiToExitMaintenance(){
  return AEP_TO_EXIT_MAINTENANCE;
}


export async function fetchPost(url, data) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response.json();
}


export async function fetchPut(url, data) {
  console.log('PUT request URL:', url);
  console.log('PUT request data:', data);

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response.json();
}

export async function fetchDelete(url,data) {
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response.json();
}

export async function fetchPatch(url,data){
  const response= await fetch(url, {
    method:"PATCH",
    headers:{
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
}
export async function fetchDataFromServer(api) {
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


