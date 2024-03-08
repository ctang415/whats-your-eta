const trains = require('../trainData');
const stations = require('../stations');

exports.get_all_trains = async (req, res, next) => {
    let data = await trains();
    return res.json(data);
}

exports.get_train_stations = async (req, res, next) => {
    let data = await stations();
    let trains = Object.values(data);
    // grabs routes that match specific train
    if (req.params.trainid.toUpperCase() === "R") {
        let length = trains.filter(element => element.routes.indexOf(req.params.trainid.toUpperCase()) > -1 && element.routes !== "SIR")
        let filteredData = trains.filter(element => element.routes.indexOf(req.params.trainid.toUpperCase()) > -1 && element.routes !== "SIR").sort((a,b) => {return a.lat - b.lat}).slice( (parseInt(req.query.page) * 5), ( parseInt(req.query.page) + 1) * req.query.limit);
        return res.json({routes: filteredData, length});
    } else {
        let length = trains.filter(element => element.routes.indexOf(req.params.trainid.toUpperCase()) > -1).length;
        let filteredData = trains.filter(element => element.routes.indexOf(req.params.trainid.toUpperCase()) > -1).sort((a,b) => {return a.lat - b.lat}).slice( ( parseInt(req.query.page) * 5), ( ( parseInt(req.query.page) + 1) * req.query.limit ));
        return res.json({routes: filteredData, length});
    }
}