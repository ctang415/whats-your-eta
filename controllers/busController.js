const getBusTime = require('../busData');
const getBusRealTime = require('../busRealTime');
const getBusAlerts = require('../busAlerts');

exports.get_bus = async (req, res, next) => {
    if (req.query.stop !== undefined) {
        let busData = await getBusRealTime();
        let filtered = busData.filter(el => el.trip.routeId == req.query.bus.toUpperCase()).map(e => { return {...e, stopTimeUpdate: e.stopTimeUpdate.filter(x => req.query.stop == x.stopId) }}).filter(el => Object.keys(el.stopTimeUpdate).length !== 0).flat().sort((a,b) => {
            if (a.stopTimeUpdate[0].arrival && b.stopTimeUpdate[0].arrival) {
                return a.stopTimeUpdate[0].arrival.time - b.stopTimeUpdate[0].arrival.time
            }}).slice(0,3);
        return res.json(filtered);
    } else {
        const data = await getBusTime(req.params.busid.toUpperCase());
        let alerts = await getBusAlerts();    
        alerts = alerts.map((el) => { return {...el, informedEntity: el.informedEntity.map(x => x.trip) }}).map(el => {return {...el, informedEntity: el.informedEntity.filter(y => y ? req.params.busid.toUpperCase() == y.routeId : null)}}).filter(el => el.informedEntity.length !== 0).reduce(function(acc, item) {
            (acc[item.informedEntity[0].routeId] || (acc[item.informedEntity[0].routeId] = [])).push(item.headerText.translation[0].text);
            return acc;
            }, {});
    
        if (data.code === 404) {
            return res.status(404).json("Bus not found.");
        }
        return res.json({route: data.data.route, stops: data.data.stops, alerts});
    }
}

exports.get_nearby_buses = async (req, res, next) => {
    let stops = {};
    async function getNearbyBuses() {
        try {
            const response = await fetch (`https://bustime.mta.info/api/where/stops-for-location.json?lat=${req.query.lat}&lon=${req.query.lon}&latSpan=0.005&lonSpan=0.005&key=${process.env.BUS_KEY}`)
            const data = await response.json();
            if (!response.ok) {
                throw await response.json();
            }
            return data;
        } catch (err) {
            console.log(err);
        }
    }
    const buses = await getNearbyBuses();
    
    function addStops() {
        for (let i = 0; i < buses.data.stops.length; i++) {
            for (let j = 0; j < buses.data.stops[i].routes.length; j++) {
                if (!stops[buses.data.stops[i].code]) {
                    stops[buses.data.stops[i].code] = [buses.data.stops[i].routes[j].shortName];
                } else {
                    stops[buses.data.stops[i].code].push(buses.data.stops[i].routes[j].shortName)
                }
            }
        }
    }
    addStops();

    let data = await getBusRealTime();
    let alerts = await getBusAlerts();
    
    alerts = alerts.map((el) => { return {...el, informedEntity: el.informedEntity.map(x => x.trip) }}).map(el => {return {...el, informedEntity: el.informedEntity.filter(y => y ? (Object.values(stops).flat()).includes(y.routeId) : null)}}).filter(el => el.informedEntity.length !== 0).reduce(function(acc, item) {
        (acc[item.informedEntity[0].routeId] || (acc[item.informedEntity[0].routeId] = [])).push(item.headerText.translation[0].text);
        return acc;
        }, {});

    let filtered = data.filter(el => Object.values(stops).flat().includes(el.trip.routeId)).map(e => { return {...e, stopTimeUpdate: e.stopTimeUpdate.filter(x => Object.keys(stops).indexOf(x.stopId) > -1)}}).filter(el => Object.keys(el.stopTimeUpdate).length !== 0).flat().sort((a,b) => {
        if (a.stopTimeUpdate[0].arrival && b.stopTimeUpdate[0].arrival) {
            return a.stopTimeUpdate[0].arrival.time - b.stopTimeUpdate[0].arrival.time
        }}).slice(0,10);

    if (buses.code === 404 || buses.fieldErrors) {
        return res.status(404).json("Resource not found.");
    }
    return res.json({stops: buses.data.stops, filtered, alerts});
}