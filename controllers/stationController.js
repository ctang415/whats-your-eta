const stations = require('../stations');
const getRealTime = require('../realTime');
const urlMap = require('../urlMap');
const fetchAlerts = require('../subwayAlerts');
const getBusRealTime = require('../busRealTime');
const getBusAlerts = require('../busAlerts');

exports.get_station = async (req, res, next) => {
    //  query for favorite train stations
    if (req.query.station !== undefined) {
        let current = (((new Date).getTime()) /1000.00);
        const stationData = await stations();
        let routes = [];
        let validStops = [];
        let station = req.query.name;
        let sorted = [];
        let geo = req.query.georeference;
        //get all trains by station
        function getAllTrains() {
            let x = (Object.values(stationData).filter(el => el.geo === req.query.georeference && el.name === req.query.name ));
            for (let i = 0; i < x.length; i++) {
                routes.push(x[i].routes.replace(/\s/g, ''));
                validStops.push(x[i].gtfs);
            }
            return routes = routes.reduce((acc, curr) => ([...acc, ...curr]), []);
        }
        getAllTrains();

        // gets real time arrivals for the trains listed in routes and filters them by the favorited station
        async function getRoutes() {
            let visited = [];
            let data = [];
            for (let i = 0; i < routes.length; i++) {
                const fn = (hashMap, str) => [...Object.keys(hashMap)].find(k => k.includes(str))
                let train = fn(urlMap, routes[i].toUpperCase());
                let url = urlMap[train];
                if (!visited.includes(url)) {
                    let results =  await getRealTime(routes[i]);
                    visited.push(url);
                    let filtered = results.map(e => { return {...e, stopTimeUpdate: e.stopTimeUpdate.filter(x => validStops.indexOf(x.stopId.slice(0,3)) > -1).reduce((current, next) => { return { ...current, ...next}; }, {})}}).filter(el => Object.keys(el.stopTimeUpdate).length !== 0).flat();
                    data.push(filtered);
                }
            }
            return sorted = data.flat();
        }

        let times = await getRoutes();

        let alerts = await fetchAlerts();
        alerts = alerts.filter(el => el.informed_entity.some(route => routes.includes(route.route_id))).filter(el => el.informed_entity.some(route => route.stop_id == req.query.station)).reduce(function(acc, item) {
            (acc[item.informed_entity[0].route_id] || (acc[item.informed_entity[0].route_id] = [])).push(item.header_text.translation[0].text);
            return acc;
            }, {});

        const north = sorted.filter(el => el.stopTimeUpdate.stopId.slice(-1) == "N").filter(el => !el.stopTimeUpdate.arrival ? parseInt((el.stopTimeUpdate.departure.time - parseInt(current))/60) >= 0 : parseInt((el.stopTimeUpdate.arrival.time - parseInt(current))/60) >= 0).sort((a,b) => {
            if (a.stopTimeUpdate.arrival && b.stopTimeUpdate.arrival) {
                return a.stopTimeUpdate.arrival.time - b.stopTimeUpdate.arrival.time
            }}).slice(0,4);
        const south = sorted.filter(el => el.stopTimeUpdate.stopId.slice(-1) == "S").filter(el => !el.stopTimeUpdate.arrival ? parseInt((el.stopTimeUpdate.departure.time - parseInt(current))/60) >= 0 : parseInt((el.stopTimeUpdate.arrival.time - parseInt(current))/60) >= 0).sort((a,b) => {
            if (a.stopTimeUpdate.arrival && b.stopTimeUpdate.arrival) {
                return a.stopTimeUpdate.arrival.time - b.stopTimeUpdate.arrival.time
            }}).slice(0,4);
        return res.json({station, alerts, north, south, geo});
    } else {
        // query for favorite bus stops
        let name = req.query.name;
        let routes = req.params.stationid.split(',');
        let busData = await getBusRealTime();
        let times = [];
        let alerts = await getBusAlerts();    
        alerts = alerts.map((el) => { return {...el, informedEntity: el.informedEntity.map(x => x.trip) }}).map(el => {return {...el, informedEntity: el.informedEntity.filter(y => y ? routes.includes(y.routeId) : null)}}).filter(el => el.informedEntity.length !== 0).reduce(function(acc, item) {
            (acc[item.informedEntity[0].routeId] || (acc[item.informedEntity[0].routeId] = [])).push(item.descriptionText.translation[0].text);
            return acc;
            }, {});
   
        async function getRoutes() {
            return times = busData.filter(el => routes.includes(el.trip.routeId)).map(e => { return {...e, stopTimeUpdate: e.stopTimeUpdate.filter(x => req.query.code == x.stopId)}}).filter(el => el.stopTimeUpdate.length !== 0).sort((a,b) => {
                if (a.stopTimeUpdate[0].arrival && b.stopTimeUpdate[0].arrival) {
                    return a.stopTimeUpdate[0].arrival.time - b.stopTimeUpdate[0].arrival.time
                }}).slice(0,3);
        }
        await getRoutes();
        return res.json({name, times, alerts});
    }
}

exports.get_nearby_station = async (req, res, next) => {
    const stationData = await stations();
    let filter = ((Object.values(stationData)).filter(el => Math.abs(el.lat - req.query.lat) < 0.01 && Math.abs(el.lon - req.query.lon) < 0.01))
    return res.json(filter);
}