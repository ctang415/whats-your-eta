const getRealTime = require('../realTime');

exports.get_train_times = async (req, res, next) => {
    let current = (((new Date).getTime()) /1000.00);
    const split = req.baseUrl.split('/');
    let trainData = await getRealTime(split[2]);
    // filter train data to only retrieve times for a specific train
    let data = trainData.filter(el => el.trip.routeId === split[2]);
    let filtered = data.map(el => el.stopTimeUpdate).flat();

    let northbound = filtered.filter(x => x.stopId.slice(-1) == "N").filter(el => el.stopId.includes(req.params.time)).filter(el => !el.arrival ? parseInt((el.departure.time - parseInt(current))/60) >= 0 : parseInt((el.arrival.time - parseInt(current))/60) >= 0).sort((a,b) => {
        if (a.arrival && b.arrival) {
            return a.arrival.time - b.arrival.time
        }
    }).slice(0,3);
    let southbound = filtered.filter(x => x.stopId.slice(-1) == "S").filter(el => el.stopId.includes(req.params.time)).filter(el => !el.arrival ? parseInt((el.departure.time - parseInt(current))/60) >= 0 : parseInt((el.arrival.time - parseInt(current))/60) >= 0).sort((a,b) => {
        if (a.arrival && b.arrival) {
            return a.arrival.time - b.arrival.time
        }
    }).slice(0,3);
    return res.json({north: northbound, south: southbound});
}