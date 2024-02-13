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
        let filteredData = trains.filter(element => element.routes.indexOf(req.params.trainid.toUpperCase()) > -1 && element.routes !== "SIR").sort((a,b) => {return a.lat - b.lat});
        return res.json({routes: filteredData});
    } else {
        let filteredData = trains.filter(element => element.routes.indexOf(req.params.trainid.toUpperCase()) > -1).sort((a,b) => {return a.lat - b.lat});
        return res.json({routes: filteredData});
    }
}