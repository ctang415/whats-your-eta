const trains = require('../trainData');
const stations = require('../stations');
const stops = require('../stops');
const getRealTime = require('../realTime');
const urlMap = require('../urlMap');

exports.get_station = async (req, res, next) => {
   let current = (((new Date).getTime()) /1000.00);
   const stationData = await stations();
   let routes = [];
   let validStops = [];
   let station = req.query.name;
   let sorted = [];
   
   //get all trains by station
   function getAllTrains() {
        let x = (Object.values(stationData).filter(el => el.name === req.query.name));
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
    const north = sorted.filter(el => el.stopTimeUpdate.stopId.slice(-1) == "N").filter(el => !el.stopTimeUpdate.arrival ? parseInt((el.stopTimeUpdate.departure.time - parseInt(current))/60) >= 0 : parseInt((el.stopTimeUpdate.arrival.time - parseInt(current))/60) >= 0).sort((a,b) => {
        if (a.stopTimeUpdate.arrival && b.stopTimeUpdate.arrival) {
            return a.stopTimeUpdate.arrival.time - b.stopTimeUpdate.arrival.time
        }}).slice(0,6);
    const south = sorted.filter(el => el.stopTimeUpdate.stopId.slice(-1) == "S").filter(el => !el.stopTimeUpdate.arrival ? parseInt((el.stopTimeUpdate.departure.time - parseInt(current))/60) >= 0 : parseInt((el.stopTimeUpdate.arrival.time - parseInt(current))/60) >= 0).sort((a,b) => {
        if (a.stopTimeUpdate.arrival && b.stopTimeUpdate.arrival) {
            return a.stopTimeUpdate.arrival.time - b.stopTimeUpdate.arrival.time
        }}).slice(0,6);
   return res.json({station, north, south});
}

exports.get_nearby_station = async (req, res, next) => {
    const stationData = await stations();
    let filter = ((Object.values(stationData)).filter(el => Math.abs(el.lat - req.query.lat) < 0.01 && Math.abs(el.lon - req.query.lon) < 0.01))
    return res.json(filter);
}