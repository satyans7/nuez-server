const controller = require("../controller/controller.js");


module.exports = function (app) {
    const AEP_TO_FETCH_AL_DATA_FROM_SERVER = "/api/data/all";









  
    app.get(AEP_TO_FETCH_AL_DATA_FROM_SERVER, (req, res) => {
        const data = controller.fetchAllDataFromServer();
        console.log(data);
        res.send(data);
    });
}