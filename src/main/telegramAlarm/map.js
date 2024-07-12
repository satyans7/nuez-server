const { InfluxDB } = require('@influxdata/influxdb-client');

// InfluxDB configuration
const url = 'http://139.59.27.195:8086'; // Replace with your InfluxDB URL
const token = '8H1jrJTgpb8pWw3DdZ9Ol5ApY7inrYE3Dx_6yfFFGTfxBbcg_vl9QvHUAKNM9XHmEZ_7ZepLApO_qsEK273aqA=='; // Replace with your InfluxDB token
const org = 'nuez'; // Replace with your InfluxDB organization
const heartbeatBucket = 'deviceHeartBeat'; // Replace with your heartbeat bucket
const waterConsumptionBucket = 'waterMeterData'; // Replace with your water consumption bucket

// Create an InfluxDB client
const influxDB = new InfluxDB({ url, token });

// Maps to store data
const heartbeatMap = new Map();
const waterConsumptionMap = new Map();
const deviceStatus = {};
let sitesBinFileNamesInMemory={};
// Function to populate heartbeatMap from InfluxDB
async function populateHeartbeatMap() {
  const queryApi = influxDB.getQueryApi(org);
  const query = `
    from(bucket: "${heartbeatBucket}")
      |> range(start: 0)
      |> filter(fn: (r) => r._measurement == "heart_beat")
      |> group(columns: ["device_id"])
      |> sort(columns: ["_time"], desc: true)
      |> limit(n: 1)
  `;

  try {
    const result = await queryApi.collectRows(query);
    result.forEach(row => {
      const deviceId = row.device_id; // Adjust this based on your schema
      heartbeatMap.set(deviceId, { value: row._value, timestamp: row._time });
    });
  } catch (error) {
    console.error(`Error querying heartbeat data: ${error}`);
  }
}

// Function to populate waterConsumptionMap from InfluxDB
async function populateWaterConsumptionMap() {
  const queryApi = influxDB.getQueryApi(org);
  const query = `
    from(bucket: "${waterConsumptionBucket}")
      |> range(start: 0)
      |> filter(fn: (r) => r._measurement == "water_meter")
      |> group(columns: ["device_id"])
      |> sort(columns: ["_time"], desc: true)
      |> limit(n: 1)
  `;
  

  try {
    const result = await queryApi.collectRows(query);
    result.forEach(row => {
      const deviceId = row.device_id; // Adjust this based on your schema
      waterConsumptionMap.set(deviceId, { value: row._value, timestamp: row._time });
    });
  } catch (error) {
    console.error(`Error querying water consumption data: ${error}`);
  }
}

// Populate the maps when the module is loaded
async function populateMaps() {
  await populateHeartbeatMap();
  await populateWaterConsumptionMap();
}

populateMaps();

module.exports = {
  heartbeatMap,
  waterConsumptionMap,
  deviceStatus,
  sitesBinFileNamesInMemory
};
