const csv=require('csvtojson');
const csvFilePath = './subway_data/stops.csv';

module.exports = async function getStops() {
    try {
        let stops = {};
        await csv().fromFile(csvFilePath).then((jsonObj)=>{
            jsonObj.forEach(element => {
                stops[element.stop_id] = {'station_id': element.stop_id, 'name': element.stop_name, 'lat': element.stop_lat, 'lon': element.stop_lon}
            });
        })
        return stops;
    } catch (err) {
        console.log(err);
    }
};





  