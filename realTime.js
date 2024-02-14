const GtfsRealtimeBindings = require("gtfs-realtime-bindings");
const urlMap = require('./urlMap');

async function getRealTime(str) {
    const fn = (hashMap, str) => [...Object.keys(hashMap)].find(k => k.includes(str))
    let train = fn(urlMap, str.toUpperCase());
    let url = urlMap[train];
    const data = await fetchData(url);
    return data;
}

const fetchData = async (url) => {
    let array = [];
    try {
    const response = await fetch (url, {
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
        array.push(entity.tripUpdate);
        //console.log(entity.tripUpdate)
    }
  });
  return array;
} catch (err) {
    console.log(err);
}
}


module.exports = getRealTime