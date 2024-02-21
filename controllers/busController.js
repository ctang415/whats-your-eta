const getBusTime = require('../busData');

exports.get_bus = async (req, res, next) => {
    console.log(req.params)
    const data = await getBusTime(req.params.busid.toUpperCase());
    console.log(data);

    if (data.code === 404) {
        return res.status(404).json("Bus not found.");
    }
    return res.json({route: data.data.route, stops: data.data.stops});
}

exports.get_nearby_buses = async (req, res, next) => {
    async function getNearbyBuses() {
        try {
            const response = await fetch (`https://bustime.mta.info/api/where/stops-for-location.json?lat=${req.query.lat}&lon=${req.query.lon}&latSpan=0.005&lonSpan=0.005&key=${process.env.BUS_KEY}`)
            const data = await response.json();
            return data;
        } catch (err) {
            console.log(err)
        }
    }
    const buses = await getNearbyBuses()
    return res.json(buses.data);
}