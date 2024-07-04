// botFunctions.js
const {heartbeatMap,waterConsumptionMap}=require('./map.js')
async function botFunction() {
    console.log("Bot function executed.");
    const axios = require('axios');
   
    // Telegram bot configuration
    const telegramBotToken = '7176670163:AAHxhW6oTlZIFYaU0XUXbk1Q8BnF1u5M1zY';
    const telegramChatId = -1002166014938;

    const statusMap = new Map();
    const consumptionCheckInterval=20000;
    
    async function heartbeatStatus() {
        heartbeatMap.forEach((h1, d1) => {
            const currentTime = new Date().getTime();
            const lastHeartbeatTime = new Date(h1).getTime();
 
            const timeDiff = (currentTime - lastHeartbeatTime) / 1000; // Time difference in seconds
            if (timeDiff <= 10) {
                statusMap.set(d1, "alive");
            } else {
                statusMap.set(d1, "dead");
            }
        });
        //console.log("status updated")
    }

    async function monitorConsumption() {
        try {
            statusMap.forEach((status, deviceId) => {
                const currentTime = new Date().getTime();
                const lastConsumptionTime = waterConsumptionMap.get(deviceId); // Use .get() to retrieve the value
    
                if (status === "alive" && (currentTime - lastConsumptionTime) > consumptionCheckInterval) {
                    const message = `Device ${deviceId} is on but not sensing data, there may be some leakage.`;
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
            });
        } catch (error) {
            console.error('Error querying', error);
        }
    }
    

    async function deviceDead() {
        const inactiveThreshold = 120; // 2 minutes in seconds
    
        for (const [deviceId, lastHeartbeat] of heartbeatMap.entries()) {
            
        const currentTime = new Date().getTime();
            const lastHeartbeatTime = new Date(lastHeartbeat).getTime();
            const timeDiff = (currentTime - lastHeartbeatTime) / 1000; // Time difference in seconds
            console.log(`Current Time: ${currentTime}, Last Heartbeat Time: ${lastHeartbeatTime}, Time Difference: ${timeDiff}`);
    
            if (timeDiff > inactiveThreshold) {
                const message = `Device ${deviceId} has been inactive for quite long.`;
               // console.log(message);
    
                try {
                    const response = await axios.post(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
                        chat_id: telegramChatId,
                        text: message,
                    });
                    console.log(`Message sent for device ${deviceId}:`, response.data);
                } catch (error) {
                    console.error(`Error sending message for device ${deviceId}:`, error);
                }
            }
        }
        // console.log("dead updated");
    }
    
    
    heartbeatStatus();
    setInterval(heartbeatStatus, 1000); // updates status map every 1 minute
    setInterval(monitorConsumption, 15000); // Run every 15 seconds
    setInterval(deviceDead, 60000); // Check device dead status every 1 minute
   
}

module.exports = {
    botFunction,
};
