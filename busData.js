async function getBusTime(search) {
    try {
        const response = await fetch (`https://bustime.mta.info/api/where/stops-for-route/MTA%20NYCT_${search}.json?key=${process.env.BUS_KEY}&includePolylines=false`, {
            method: 'GET', headers: {'Content-type': 'application/json'}
        });
        const data = await response.json();
        return data;
    } catch (err) {
        console.log(err);
    }
}

module.exports = getBusTime