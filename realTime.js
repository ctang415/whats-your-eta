const GtfsRealtimeBindings = require("gtfs-realtime-bindings");

async function getRealTime(str) {
    const fn = (hashMap, str) => [...Object.keys(hashMap)].find(k => k.includes(str))
    const urlMap = {
        "ACE":"https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-ace",
        "BDFM": "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-bdfm",
        "NQRW": "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-nqrw",
        "JZ": "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-jz",
        "L": "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-l",
        "G": "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-g", 
        "1234567": "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs",
        "SI": "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-si"
    };
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