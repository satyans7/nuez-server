const fs = require("fs");
const { waterConsumptionMap, heartbeatMap, deviceStatus } = require("../telegramAlarm/map");
let cloud_mqtt;
const path = require ('path');
function  initializeMqttClients(cloudClient) {

  cloud_mqtt = cloudClient;
}
function initializeTopics() {
  return {
    MQTT_CLOUD_WATER_CONSUMPTION_DATA: "water-consumption-data",
    MQTT_CLOUD_DEVICE_STATUS_INFO: "device-status-info/#",
    MQTT_CLOUD_DEVICE_VERSION_INFO: "device-version-info/#",
    MQTT_CLOUD_DEVICE_HEARTBEAT_INFO: "device-heartbeat-info/#",

    MQTT_CLOUD_PREFIX_DEVICE_STATUS_INFO: "device-status-info",
    MQTT_CLOUD_PREFIX_DEVICE_VERSION_INFO: "device-version-info",
    MQTT_CLOUD_PREFIX_DEVICE_HEARTBEAT_INFO: "device-heartbeat-info"

  };
}

function handleMessage(topic, message, topics) {
  const [topicName, siteId] = topic.split("/");
  try {
    switch (topicName) {
      case topics.MQTT_CLOUD_PREFIX_DEVICE_VERSION_INFO:
        handleDeviceVersionInfo(message, topics);
        break;
      case topics.MQTT_CLOUD_WATER_CONSUMPTION_DATA:
        handleWaterConsumptionData(message, topics);
        break;

      case topics.MQTT_CLOUD_PREFIX_DEVICE_STATUS_INFO:
        handleDeviceStatusInfo(message, topics,siteId);
        break;
      case topics.MQTT_CLOUD_PREFIX_DEVICE_HEARTBEAT_INFO:
        handleHeartbeat(message, topics);
        break;
      default:
        console.warn(`No handler for topic: ${topic}`);
    }
  } catch (error) {
    console.error(`Error handling message for topic ${topic}:`, error);
  }
}

const handleDeviceStatusInfo = async (message, topics,siteId) => {
  const parsedMessage = JSON.parse(message.toString());
  deviceStatus[siteId] = parsedMessage;
        updateDeviceData(
          path.join(__dirname, "../database/json-data/deviceToProfile.json"),
          "status",
          parsedMessage
        );
}
const handleDeviceVersionInfo = async (message, topics) => {
  const parsedMessage = JSON.parse(message.toString());

  updateDeviceData(
    path.join(__dirname, "../database/json-data/deviceToProfile.json"),
    "version",
    parsedMessage
  );
}
const handleWaterConsumptionData = async (message, topics) => {
  const parsedMessage = JSON.parse(message.toString());
  const { site_id, device_id } = parsedMessage;
  const networkTime = await fetchNetworkTime();
  waterConsumptionMap.set(parsedMessage.device_id, networkTime);
  handleRegistration(site_id, device_id);
}
const handleHeartbeat = async (message, topics) => {
  const parsedMessage = JSON.parse(message.toString());
    const networkTime = await fetchNetworkTime();
    heartbeatMap.set(parsedMessage.device_id,networkTime);
  
}

const handleRegistration = (siteId, deviceId) => {
  if (!siteIds[siteId]) {
    siteIds[siteId] = { name: siteId, location: "default" };
    writeDatabase(siteIdsFilePath, siteIds);
  }

  if (!deviceIds[deviceId]) {
    deviceIds[deviceId] = { name: deviceId, siteId: siteId ,location: "default", owner:"Not Assigned" };
    writeDatabase(deviceIdsFilePath, deviceIds);
  }

  if (!siteToDevice[siteId]) {
    siteToDevice[siteId] = [];
  }

  if (!siteToDevice[siteId].includes(deviceId)) {
    siteToDevice[siteId].push(deviceId);
    writeDatabase(siteToDeviceFilePath, siteToDevice);
  }
}


const handleCloudMqttPublish=(publishTopic,message)=>{
  cloud_mqtt.publish(publishTopic,message); 
}
//------------UTILITY FUNCTIONS------------//
const fetchNetworkTime = () => {
  const localTime = new Date();
  return localTime.getTime(); // Returns the Unix timestamp in milliseconds
};

const siteIdsFilePath = path.join(__dirname, "../database/json-data/siteRegistration.json");
const deviceIdsFilePath = path.join(__dirname, "../database/json-data/deviceToProfile.json");
const siteToDeviceFilePath = path.join(__dirname, "../database/json-data/siteToDevices.json");

// Utility functions for database operations
const readDatabase = (filePath) => {
  return JSON.parse(fs.readFileSync(filePath));
}

const writeDatabase = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}


 // In-memory storage for site and device data
 const siteIds =readDatabase(siteIdsFilePath);
 const deviceIds =readDatabase(deviceIdsFilePath);
 const siteToDevice =readDatabase(siteToDeviceFilePath);

// Function to update device data
const updateDeviceData = (filePath, dataKey, updateData) => {
  const rawData = readDatabase(filePath);
  for (const [device_id, data] of Object.entries(updateData)) {
    if (rawData.hasOwnProperty(device_id)) {
      rawData[device_id][dataKey] = data;
    }
  }
  writeDatabase(filePath, rawData);
  console.log(`Device ${dataKey}s updated successfully.`);
}
module.exports = {
  initializeMqttClients,
  initializeTopics,
  handleMessage,
  handleCloudMqttPublish
}