const trains = require('../trainData');
const stations = require('../stations');
const getRealTime = require('../realTime');

exports.get_station = async (req, res, next) => {
   const trainData = await trains();
   const stationData = await stations();
   let routes = [];
   let validStops = [];
   let station = req.query.name;
   let sorted = []
   let tested = [];
   
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
   
   // get designated train color
   function getColor() {
        return trainData[routes[0]].color;
   }
   const color = getColor();
   
   // gets real time arrivals for the trains listed in routes and filters them by the favorited station
   async function getRoutes() {
        let data = [];
        for (let i = 0; i < routes.length; i++) {
            let results =  await getRealTime(routes[i]);
            let filtered = results.map(e => { return {...e, stopTimeUpdate: e.stopTimeUpdate.filter(x => validStops.indexOf(x.stopId.slice(0,3)) > -1)
                .reduce((current, next) => { return { ...current, ...next}; }, {})}}).filter(el => Object.keys(el.stopTimeUpdate).length !== 0).flat();
            data.push(filtered);
        }
        tested = data.flat();
        return sorted = data.flat();
    }
    let times = await getRoutes();
    console.log(sorted)
    const north = sorted.filter(el => el.stopTimeUpdate.stopId.slice(-1) == "N").sort((a,b) => { return a.stopTimeUpdate.arrival.time - b.stopTimeUpdate.arrival.time}).slice(0,6);
    const south = sorted.filter(el => el.stopTimeUpdate.stopId.slice(-1) == "S").slice(0,6);

    //const north = []
    //const south = [] 
   return res.json({color, station, north, south, tested});
}