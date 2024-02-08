const trains = require('../trainData');
const stations = require('../stations');
const GtfsRealtimeBindings = require("gtfs-realtime-bindings");
const urlMap = require('../realTime');

exports.get_all_trains = async (req, res, next) => {
    let data = await trains();
    console.log(data)
    return res.json(data);
}

exports.get_train_stations = async (req, res, next) => {
    let data = await stations();
    let trains = Object.values(data);
    let filteredData = trains.filter(element => element.routes.indexOf(req.params.trainid.toUpperCase()) > -1);

    async function fetchData() {
        try {
        const response = await fetch ('https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-bdfm', {
        method: 'GET', headers: {'Content-type': 'application/json', "x-api-key": `${process.env.API_KEY}`}
        })
        if (!response.ok) {
          const error = new Error(`${response.url}: ${response.status} ${response.statusText}`);
          error.response = response;
          throw error;
        }
        const buffer = await response.arrayBuffer();
        const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(
        new Uint8Array(buffer)
      );
      feed.entity.forEach((entity) => {
        if (entity.tripUpdate) {
        console.log(entity.tripUpdate)
          //let time = entity.tripUpdate.stopTimeUpdate[0].arrival.time
         // console.log(new Date(time * 1000).toLocaleTimeString());
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
  console.log(urlMap)
//  let x = fetchData()
  //console.log(x);
    return res.json(filteredData);
}