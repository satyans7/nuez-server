const { heartbeatMap, waterConsumptionMap } = require('./map.js');
const axios = require('axios');
// const TelegramBot = require('node-telegram-bot-api');

// const telegramBotToken = '7176670163:AAHxhW6oTlZIFYaU0XUXbk1Q8BnF1u5M1zY';
// const telegramChatId = -1002166014938;

// const bot = new TelegramBot(telegramBotToken, { polling: true });
// const statusMap = new Map();
// const snoozeMap = new Map(); // To store snooze information for each device
// const consumptionCheckInterval = 20000;

async function botFunction() {
    console.log("Bot function executed.");

    // async function heartbeatStatus() {
    //     heartbeatMap.forEach((h1, d1) => {
    //         const currentTime = new Date().getTime();
    //         const lastHeartbeatTime = new Date(h1).getTime();

    //         const timeDiff = (currentTime - lastHeartbeatTime) / 1000; // Time difference in seconds
    //         if (timeDiff <= 10) {
    //             statusMap.set(d1, "alive");
    //         } else {
    //             statusMap.set(d1, "dead");
    //         }
    //     });
    // }

    // async function monitorConsumption() {
    //     try {
    //         statusMap.forEach((status, deviceId) => {
    //             const currentTime = new Date().getTime();
    //             const lastConsumptionTime = waterConsumptionMap.get(deviceId); // Use .get() to retrieve the value

    //             if (status === "alive" && (currentTime - lastConsumptionTime) > consumptionCheckInterval) {
    //                 if (isDeviceSnoozed(deviceId)) {
    //                     console.log(`Device ${deviceId} is snoozed. Skipping alert.`);
    //                 } else {
    //                     const message = `Device with device_id:-"${deviceId}" is on but not sensing data, there may be some leakage.`;
    //                     console.log(message);
    //                     axios.post(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
    //                         chat_id: telegramChatId,
    //                         text: message,
    //                     }).then(response => {
    //                         console.log(`Message sent for device ${deviceId}:`, response.data);
    //                     }).catch(error => {
    //                         console.error(`Error sending message for device ${deviceId}:`, error);
    //                     });
    //                 }
    //             }
    //         });
    //     } catch (error) {
    //         console.error('Error querying', error);
    //     }
    // }

    // async function deviceDead() {
    //     const inactiveThreshold = 120; // 2 minutes in seconds

    //     for (const [deviceId, lastHeartbeat] of heartbeatMap.entries()) {
    //         const currentTime = new Date().getTime();
    //         const lastHeartbeatTime = new Date(lastHeartbeat).getTime();
    //         const timeDiff = (currentTime - lastHeartbeatTime) / 1000; // Time difference in seconds
    //         console.log(`Current Time: ${currentTime}, Last Heartbeat Time: ${lastHeartbeatTime}, Time Difference: ${timeDiff}`);

    //         if (timeDiff > inactiveThreshold) {
    //             if (isDeviceSnoozed(deviceId)) {
    //                 console.log(`Device ${deviceId} is snoozed. Skipping alert.`);
    //             } else {
    //                 const message = `Device with device_id:-"${deviceId}" has been inactive for quite long.`;
    //                 try {
    //                     const response = await axios.post(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
    //                         chat_id: telegramChatId,
    //                         text: message,
    //                     });
    //                     console.log(`Message sent for device ${deviceId}:`, response.data);
    //                 } catch (error) {
    //                     console.error(`Error sending message for device ${deviceId}:`, error);
    //                 }
    //             }
    //         }
    //     }
    // }

    // function isDeviceSnoozed(deviceId) {
    //     if (!snoozeMap.has(deviceId)) return false;
    //     const snoozeUntil = snoozeMap.get(deviceId);
    //     return snoozeUntil > Date.now();
    // }

    // bot.onText(/\/snooze (\d+)/, (msg, match) => {
    //     const chatId = msg.chat.id;
    //     const time = parseInt(match[1], 10); // Extract <time> from the command
    //     const repliedToMessage = msg.reply_to_message;

    //     if (repliedToMessage) {
    //         const repliedText = repliedToMessage.text;
    //         const deviceIdMatch = repliedText.match(/device_id:-"(.+?)"/);
    //         if (deviceIdMatch) {
    //             const deviceId = deviceIdMatch[1];
    //             snoozeMap.set(deviceId, Date.now() + time * 1000);

    //             bot.sendMessage(chatId, `Notifications for device ${deviceId} snoozed for ${time} seconds.`);
    //         } else {
    //             bot.sendMessage(chatId, `Could not find a valid device_id in the replied message.`);
    //         }
    //     } else {
    //         bot.sendMessage(chatId, `Please reply to a message containing a device_id with the snooze command.`);
    //     }
    // });

    // heartbeatStatus();
    // setInterval(heartbeatStatus, 1000); // updates status map every 1 minute
    // setInterval(monitorConsumption, 30000); // Run every 15 seconds
    // setInterval(deviceDead, 60000); // Check device dead status every 1 minute
}

module.exports = {
    botFunction,
};
