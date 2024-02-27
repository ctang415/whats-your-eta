import { useState } from "react";
import { useEffect } from "react"
import Bus from "./bus";
import BusAlert from "./busAlert";
import BusStops from "./busStops";

const Buses = () => {
    const [buses, setBuses] = useState([]);
    const [nearbyBuses, setNearbyBuses] = useState(false);
    const [search, setSearch] = useState('');
    const [searched, setSearched] = useState(false);
    const [error, setError] = useState('');
    const [busTimes, setBusTimes] = useState([]);
    const [alerts, setAlerts] = useState([]);

    async function getBusData(e) {
        e.preventDefault();
        setSearched(false);
        setBuses([]);
        setAlerts([]);
        setError('');
        try {
            const response = await fetch (`http://localhost:3000/buses/${search}`);
            if (!response.ok) {
                throw await response.json();
            }
            const data = await response.json();
            console.log(data);
            setBuses(data);
            setSearched(true);
        } catch (err) {
            setError(err);
            console.log(err);
        }
    }

    useEffect(() => {
        if (nearbyBuses) {
            function successFunction(position) {
                async function getNearbyBusData() {
                    setSearched(false);
                    setBuses([]);
                    setAlerts([]);
                    setError('');
                    try {
                        const response = await fetch (`http://localhost:3000/buses/?lat=${position.coords.latitude}&lon=${position.coords.longitude}`);
                        const data = await response.json();
                        if (!response.ok) {
                            throw await response.json();
                        }
                        console.log(data);
                        setAlerts(data.alerts);
                        setBuses(data.stops);
                        setBusTimes(data.filtered);
                        setNearbyBuses(false);
                    } catch (err) {
                        setError(err)
                        console.log(err);
                    }
                }
                getNearbyBusData();
            }
          
            function errorFunction() {
                console.log("Unable to retrieve your location.");
            }
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
            } else {
                console.log("Geolocation is not supported by this browser.");
            }
        }  
    }, [nearbyBuses]);

    if (!searched) {
    return (
        <div className="flex flex-col self-center w-6/12 p-2 rounded-xl min-h-screen bg-slate-200">
            <div className="flex flex-row justify-around py-4">
                <form className="self-center flex flex-row gap-2" onSubmit={(e) => getBusData(e)}>
                    <input className="p-2 rounded-xl" placeholder="Search by bus" onChange={(e) => setSearch(e.target.value.trim())} required/>
                    <button className="bg-slate-400 rounded-full p-2 text-white font-bold hover:scale-105" type='submit'>Search</button>
                </form>
                <div className="self-center">
                    <button className="p-2 bg-blue-500 text-white rounded-full font-bold hover:scale-105" onClick={() => setNearbyBuses(true)}>Check Nearby Stops</button>
                </div>
            </div>
            <p className="self-center">{error}</p>
            <ul>
                {Object.entries(alerts).map(([name, obj]) => ({name, ...obj})).map((alert, index) =>{
                    return (
                        <div key={index}>
                            <BusAlert alert={alert}/>
                        </div>
                    )
                })}
                {buses.map( (bus, index) => {
                    return (
                        <div key={index}>
                            <Bus bus={bus} busTimes={busTimes}/>
                        </div>
                    )
                })}
            </ul>
        </div>
    )
    } else {
        return (
            <div className="flex flex-col self-center w-6/12 p-2 rounded-xl min-h-screen bg-slate-200">
                <div className="flex flex-row justify-around py-4">
                    <form className="self-center flex flex-row gap-2" onSubmit={(e) => getBusData(e)}>
                        <input className="p-2 rounded-xl" placeholder="Search by bus" onChange={(e) => setSearch(e.target.value)}/>
                        <button className="bg-slate-400 rounded-full p-2 text-white font-bold hover:scale-105" type='submit'>Search</button>
                    </form>
                    <div className="self-center">
                        <button className="p-2 bg-blue-500 text-white rounded-full font-bold hover:scale-105" onClick={() => setNearbyBuses(true)}>Check Nearby Stops</button>
                    </div>
                </div>
                <ul className="flex flex-col gap-1 p-2">
                    {Object.entries(buses.alerts).map(([name, obj]) => ({name, ...obj})).map((alert, index) =>{
                        return (
                            <div key={index}>
                                <BusAlert alert={alert} alerts={buses.alerts}/>
                            </div>
                        )
                    })}
                    <h3 className="font-bold text-3xl text-center">{buses.route.shortName}</h3>
                    {buses.stops.map( (bus, index) => {
                        return (
                            <div key={index}>
                                <BusStops search={search} bus={bus}/>
                            </div>
                        )
                    })}
                </ul>
            </div>
        )
    }
}
export default Buses