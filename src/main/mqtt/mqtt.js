const mqtt = require("mqtt");
const { initializeMqttClients, handleMessage } = require("./helper");
const mqttBrokerUrl ="mqtt://206.189.138.34";
const mqttOptions={
  port:1883,
  username:"nuez",
  password: "emqx@nuez"
};

const cloud_mqtt=mqtt.connect(mqttBrokerUrl,mqttOptions)

initializeMqttClients(cloud_mqtt);

function subscribeMqttTopics(mqttClient, topicNames) {
  topicNames.forEach(topic => {
    mqttClient.subscribe(topic, (err) => {
      if (err) {
        console.error(`Error subscribing to ${topic} topic:`, err);
      } else {
        console.log(`Subscribed to ${topic} topic.`);
      }
    });
  });
}

function handleCloudMqttConnect(topics) {
  cloud_mqtt.on("connect", () => {
    console.log("Connected to cloud MQTT broker.");
    subscribeMqttTopics(cloud_mqtt, [
      topics.MQTT_CLOUD_WATER_CONSUMPTION_DATA,
      topics.MQTT_CLOUD_DEVICE_STATUS_INFO ,
      topics.MQTT_CLOUD_DEVICE_VERSION_INFO,
      topics.MQTT_CLOUD_DEVICE_HEARTBEAT_INFO 
    ]);
  });
}

function handleCloudMqttMessage(topics) {
  cloud_mqtt.on("message", (topic, message) => {
    handleMessage(topic, message, topics);
  });
}

module.exports={
  handleCloudMqttConnect,
  handleCloudMqttMessage
}