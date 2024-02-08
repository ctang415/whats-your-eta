const csv=require('csvtojson');
const csvFilePath = './subway_data/routes.csv';

// returns all trains with assigned train color
module.exports = async function getRoutes() {
    try {
        let routes = {};
        await csv().fromFile(csvFilePath).then((jsonObj)=>{
            jsonObj.forEach(element => {
                if (!element.route_short_name.includes("X") && !element.route_long_name.includes("Shuttle")) {
                    routes[element.route_id] = {"name": element.route_id, 'color': element.route_color}
                }
            });
        })
        return routes;
    } catch (err) {
        console.log(err);
    }
};