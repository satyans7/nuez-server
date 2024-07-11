const { heartbeatMap, waterConsumptionMap } = require('./map.js');
const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');

const telegramBotToken = '7176670163:AAHxhW6oTlZIFYaU0XUXbk1Q8BnF1u5M1zY';
const telegramChatId = -1002166014938;

const bot = new TelegramBot(telegramBotToken, { polling: true });
const TELEGRAM_POST_URL = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`
const statusMap = new Map();
const snoozeMap = new Map(); // To store snooze information for each device
const consumptionCheckInterval = 20000000000;
const INTERVAL_FOR_HEARTBEAT_FUNCTION_CALL = 100000000;
const INTERVAL_FOR_WATER_CONSUMPTION_FUNCTION_CALL = 3000000000;
const INTERVAL_FOR_DEVICE_DEAD_CHECK_FUNCTION_CALL = 6000000000;
const TELEGRAM_BOT_COMMAND = 'snooze';
const EXPRESSION_FOR_DEVICE_ID = `device_id:-"(.+?)"`;
async function botFunction() {
    console.log("Bot function executed.");
    console.log(heartbeatMap, waterConsumptionMap);
    async function heartbeatStatus() {
        heartbeatMap.forEach((deviceData, deviceId) => {
            const currentTime = new Date().getTime();
            const lastHeartbeatTime = new Date(deviceData.timestamp).getTime();
            const timeDiff = (currentTime - lastHeartbeatTime) / 1000; // Time difference in seconds

            if (timeDiff <= 10) {
                statusMap.set(deviceId, "alive");
            } else {
                statusMap.set(deviceId, "dead");
            }
        });
    }


    async function monitorConsumption() {
        try {
            statusMap.forEach((status, deviceId) => {
                const currentTime = new Date().getTime();
                const lastConsumptionTime = waterConsumptionMap.get(deviceId).timestamp;

                if (status === "alive" && (currentTime - new Date(lastConsumptionTime).getTime()) > consumptionCheckInterval) {
                    if (isDeviceSnoozed(deviceId)) {
                        console.log(`Device ${deviceId} is snoozed. Skipping alert.`);
                    } else {
                        const message = `Device with device_id:-"${deviceId}" is on but not sensing data, there may be some leakage.`;
                        console.log(message);
                        axios.post(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
                            chat_id: telegramChatId,
                            text: message,
                        }).then(response => {
                            console.log(`Message sent for device ${deviceId}:`, response.data);
                        }).catch(error => {
                            console.error(`Error sending message for device ${deviceId}:`, error);
                        });
                    }
                }
            });
        } catch (error) {
            console.error('Error querying', error);
        }
    }

    async function deviceDead() {
        const inactiveThreshold = 120; // 2 minutes in seconds

        for (const [deviceId, deviceData] of heartbeatMap.entries()) {
            const currentTime = new Date().getTime();
            const lastHeartbeatTime = new Date(deviceData.timestamp).getTime();
            const timeDiff = (currentTime - lastHeartbeatTime) / 1000; // Time difference in seconds
            console.log(`Current Time: ${currentTime}, Last Heartbeat Time: ${lastHeartbeatTime}, Time Difference: ${timeDiff}`);

            if (timeDiff > inactiveThreshold) {
                if (isDeviceSnoozed(deviceId)) {
                    console.log(`Device ${deviceId} is snoozed. Skipping alert.`);
                } else {
                    const message = `Device with device_id:-"${deviceId}" has been inactive for quite long.`;
                    try {
                        const response = await axios.post(TELEGRAM_POST_URL, {
                            chat_id: telegramChatId,
                            text: message,
                        });
                        console.log(`Message sent for device ${deviceId}:`, response.data);
                    } catch (error) {
                        console.error(`Error sending message for device ${deviceId}:`, error);
                    }
                }
            }
        }
    }


    function isDeviceSnoozed(deviceId) {
        if (!snoozeMap.has(deviceId)) return false;
        const snoozeUntil = snoozeMap.get(deviceId);
        return snoozeUntil > Date.now();
    }

    bot.onText(new RegExp(`/${TELEGRAM_BOT_COMMAND} (\\d+)`), (msg, match) => {
        const chatId = msg.chat.id;
        const time = parseInt(match[1], 10); // Extract <time> from the command
        const repliedToMessage = msg.reply_to_message;

        if (repliedToMessage) {
            const repliedText = repliedToMessage.text;
            const deviceIdMatch = repliedText.match(new RegExp(EXPRESSION_FOR_DEVICE_ID));
            if (deviceIdMatch) {
                const deviceId = deviceIdMatch[1];
                snoozeMap.set(deviceId, Date.now() + time * 1000);

                bot.sendMessage(chatId, `Notifications for device ${deviceId} snoozed for ${time} seconds.`);
            } else {
                bot.sendMessage(chatId, `Could not find a valid device_id in the replied message.`);
            }
        } else {
            bot.sendMessage(chatId, `Please reply to a message containing a device_id with the snooze command.`);
        }
    });


    heartbeatStatus();
    setInterval(heartbeatStatus, INTERVAL_FOR_HEARTBEAT_FUNCTION_CALL); // updates status map every 1 minute
    setInterval(monitorConsumption, INTERVAL_FOR_WATER_CONSUMPTION_FUNCTION_CALL); // Run every 15 seconds
    setInterval(deviceDead, INTERVAL_FOR_DEVICE_DEAD_CHECK_FUNCTION_CALL); // Check device dead status every 1 minute
}

module.exports = {
    botFunction,
};

// Here are a few commonly used Telegram Bot API endpoints and their purposes:

// /sendMessage: Sends a message to a chat.
// /sendPhoto: Sends a photo to a chat.
// /sendDocument: Sends a document to a chat.
// /sendVideo: Sends a video to a chat.
// /sendAudio: Sends an audio file to a chat.
// /editMessageText: Edits a text message.
// /deleteMessage: Deletes a message.
