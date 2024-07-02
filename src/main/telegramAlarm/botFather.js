module.exports = function (app) {
const { InfluxDB } = require('@influxdata/influxdb-client');
const axios = require('axios');

// InfluxDB configuration
const token = 'your_influxdb_token';
const org = 'your_org';
const bucket = 'your_bucket';
const client = new InfluxDB({ url: 'http://192.168.33.250:8086', token });
const queryApi = client.getQueryApi(org);

// Telegram bot configuration
const telegramBotToken = '7176670163:AAHxhW6oTlZIFYaU0XUXbk1Q8BnF1u5M1zY';
const telegramChatId = -1002166014938;

// Function to monitor total consumption
async function monitorConsumption() {
  const query = `
    from(bucket: "${bucket}")
      |> range(start: -1m)
      |> filter(fn: (r) => r._measurement == "your_measurement" && r._field == "total_consumption")
      |> group(columns: ["device_id"])
      |> keep(columns: ["_time", "_value", "device_id"])
  `;

  try {
    // const results = await queryApi.collectRows(query);

     const deviceConsumptionMap = new Map();

    // results.forEach(result => {
    //   const { device_id, _value, _time } = result;
    //   if (!deviceConsumptionMap.has(device_id)) {
    //     deviceConsumptionMap.set(device_id, []);
    //   }
    //   deviceConsumptionMap.get(device_id).push({ time: _time, value: _value });
    // });

    const devicesWithConstantConsumption = [];

    deviceConsumptionMap.forEach((dataPoints, deviceId) => {
      if (dataPoints.every(point => point.value === dataPoints[0].value)) {
        devicesWithConstantConsumption.push(deviceId);
      }
    });
devicesWithConstantConsumption.push('4');
    devicesWithConstantConsumption.forEach(deviceId => {
      const message = `Device ${deviceId} is on but not sensing data, there may be some leakage.`;
      axios.post(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
        chat_id: telegramChatId,
        text: message,
      }).then(response => {
        console.log(`Message sent for device ${deviceId}:`, response.data);
      }).catch(error => {
        console.error(`Error sending message for device ${deviceId}:`, error);
      });
    });

  } catch (error) {
    console.error('Error querying InfluxDB:', error);
  }
}

// Set up a periodic task to monitor consumption every minute
//setInterval(monitorConsumption, 6000); // Run every minute
}

