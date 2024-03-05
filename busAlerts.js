const GtfsRealtimeBindings = require("gtfs-realtime-bindings");

async function getBusAlerts() {
    let array = [];
    try {
        const response = await fetch (`https://gtfsrt.prod.obanyc.com/alerts?key=${process.env.BUS_KEY}`);
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
          if (entity.alert) {
              array.push(entity.alert);
          }
        });
        return array;
    } catch (err) {
        console.log(err);
        return err;
    }
}


module.exports = getBusAlerts