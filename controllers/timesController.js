const getRealTime = require('../realTime');

exports.get_train_times = async (req, res, next) => {
    const split = req.baseUrl.split('/');
    let trainData = await getRealTime(split[2]);
    // filter train data to only retrieve times for a specific train
    let data = trainData.filter(el => el.trip.routeId === split[2]);
    let filtered = data.map(el => el.stopTimeUpdate).flat();
    let northbound = filtered.filter(x => x.stopId.slice(-1) == "N")
    let southbound =  filtered.filter(x => x.stopId.slice(-1) == "S")
    return res.json({north: northbound, south: southbound});
}