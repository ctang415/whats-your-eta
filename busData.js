async function getBusTime(search) {
    try {
        const response = await fetch (`https://bustime.mta.info/api/where/stops-for-route/MTA%20NYCT_${search}.json?key=${process.env.BUS_KEY}&includePolylines=false&version=2`, {
            method: 'GET', headers: {'Content-type': 'application/json'}
        });
        if (!response.ok) {
            throw await response.json();
        }
        const data = await response.json();
        return data;
    } catch (err) {
        console.log(err);
        return err;
    }
}

module.exports = getBusTime