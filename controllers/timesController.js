const getRealTime = require('../realTime');

exports.get_train_times = async (req, res, next) => {
    let trainData = await getRealTime(req.params.trainid);
    // filter train data to only retrieve times for a specific train
    let data = trainData.filter(el => el.trip.routeId === req.params.trainid);
    let filtered = data.map(el => el.stopTimeUpdate).flat();
    let northbound = filtered.filter(x => x.stopId.slice(-1) == "N")
    let southbound =  filtered.filter(x => x.stopId.slice(-1) == "S")
    return res.json({north: northbound, south: southbound});
}