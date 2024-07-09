const { InfluxDB } = require('@influxdata/influxdb-client');

// InfluxDB configuration
const url = 'http://206.189.138.34:8086'; // Replace with your InfluxDB URL
const token = 'Le35X6VPDyYO1xYMJrhID2ItpWQXE6P1ZTDMoYwZ_oZgqFSal6-qO8Se6LoUTtJlXADWeBVs83jP6n_h7bXYHw=='; // Replace with your InfluxDB token
const org = 'nuez'; // Replace with your InfluxDB organization
const heartbeatBucket = 'DeviceHeartBeat'; // Replace with your heartbeat bucket
const waterConsumptionBucket = 'waterMeterData'; // Replace with your water consumption bucket

// Create an InfluxDB client
const influxDB = new InfluxDB({ url, token });

// Maps to store data
const heartbeatMap = new Map();
const waterConsumptionMap = new Map();
const deviceStatus = {};

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
  deviceStatus
};
