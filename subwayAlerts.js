
async function fetchAlerts() {
    let array = [];
    try {
        const response = await fetch (`https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/camsys%2Fsubway-alerts.json`, {
            method: 'GET', headers: {'Content-type': 'application/json', "x-api-key": `${process.env.API_KEY}`}
        });
        if (!response.ok) {
            const error = new Error(`${response.url}: ${response.status} ${response.statusText}`);
            error.response = response;
            throw error;
        }
        const data = await response.json();
        data.entity.forEach((entity) => {
            if (entity.alert) {
                array.push(entity.alert);
            }
          });
        return array;
    } catch (err) {
        console.log(err);
    }
}


module.exports = fetchAlerts