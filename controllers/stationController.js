const trains = require('../trainData');
const stations = require('../stations');
const getRealTime = require('../realTime');

exports.get_station = async (req, res, next) => {
   const trainData = await trains();
   const routes = req.params.stationid.split('');

   function getColor () {
        return trainData[routes[0]];
   }
   const color = getColor();
   
   async function getRoutes() {
        let data = [];
        for (let i = 0; i < routes.length; i++) {
            let results = await getRealTime(routes[i]);
            let filtered = results.map(el => el.stopTimeUpdate).flat().filter(el => el.stopId.includes(req.query.station));
            data.push(filtered);
        }
        return data;
    }
    let times = await getRoutes();

    const north = times[0].filter(el => el.stopId.slice(-1) == "N");
    const south = times[0].filter(el => el.stopId.slice(-1) == "S");
    let station = req.query.name
    return res.json({color, station, north, south});
}