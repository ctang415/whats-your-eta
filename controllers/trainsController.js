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
    let filteredData = trains.filter(element => element.routes.indexOf(req.params.trainid.toUpperCase()) > -1);
    return res.json({routes: filteredData});
}