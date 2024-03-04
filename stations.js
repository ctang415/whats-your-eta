const csv=require('csvtojson');
const csvFilePath = './subway_data/stations.csv';

module.exports = async function getStations() {
    try {
        let stations = {};
        let data = await csv().fromFile(csvFilePath).then((jsonObj)=>{
            jsonObj.forEach(element => {
                stations[element.gtfs_stop_id] = {'station_id': element.station_id, 'gtfs': element.gtfs_stop_id, 'name': element.stop_name, 'routes': element.daytime_routes, 'lat': element.gtfs_latitude, 'lon': element.gtfs_longitude, 'geo': element.georeference}
            });
            return stations;
        })
        return data;
    } catch (err) {
        console.log(err);
    }
};




  