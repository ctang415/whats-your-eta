import { useState, useEffect } from "react";
import Time from "./time";
import Image from "./image";
import Favorited from "../assets/filled_favorite.svg";
import { useContext } from "react";
import { Context } from "./context";
import Alert from "./alert";
import BusFavoriteTime from "./busFavoriteTime";
import BusAlert from "./busAlert";

const Home = () => {
    const [current, setCurrent] = useState(((new Date).getTime()) /1000.00);
    const [favorites, setFavorites] = useState([]);
    const [busFavorites, setBusFavorites] = useState([]);
    const [ isLoading, setIsLoading] = useState(true);
    const {removeFromFavorites, removeFromBusFavorites} = useContext(Context);
    const [nearbyStations, setNearbyStations] = useState(false);
    const [stations, setStations] = useState([]);
    const [buses, setBuses] = useState([])
    let ignore = false;

  async function getStations(trains, station, name, geo) {
        try {
            const response = await fetch (`http://localhost:3000/favorites/${trains}?station=${station}&name=${name}&georeference=${geo}`);
            const data = await response.json();
            setFavorites(favorites =>[...favorites, data]);
        } catch (err) {
            console.log(err);
        }
    }
    
    async function getBuses(buses, name, code) {
        try {
            const response = await fetch (`http://localhost:3000/favorites/${buses}?name=${name}&code=${code}`);
            const data = await response.json();
            setBusFavorites(favorites => [...favorites, data]);
        } catch (err) {
            console.log(err);
        }
    }

    function mapFavorites() {
        if (JSON.parse(localStorage.getItem("trains")) !== null) {  
            let x = JSON.parse(localStorage.getItem("trains"));
            for (let i = 0; i < x.length; i++) {
                getStations(
                (x[i]).route.replace(/\s/g, ''),
                (x[i]).id,
                (x[i].name),
                (x[i].geo)
            );
        }
    }
        if (JSON.parse(localStorage.getItem("buses")) !== null) {  
            let x = JSON.parse(localStorage.getItem("buses"));
            for (let i = 0; i < x.length; i++) {
                getBuses(
                    x[i].buses.map(x => x.shortName),
                    x[i].stop,
                    x[i].code
                )
            }
        }
    }

   async function getNearbyStations(position) {
        try {
            const response = await fetch (`http://localhost:3000/?lat=${position.coords.latitude}&lon=${position.coords.longitude}`)
            const data = await response.json();
            if(!response.ok) {
                throw await response.json();
            }
            setStations(data);
            for (let i = 0; i < data.length; i++) {
                getStations(
                    data[i].routes.replace(/\s/g, ''),
                    data[i].gtfs,
                    data[i].name,
                    data[i].geo
                );
            }
        } catch (err) {
            console.log(err);
        }
    }

    async function getNearbyBusData(position) {
        try {
            const response = await fetch (`http://localhost:3000/buses/?lat=${position.coords.latitude}&lon=${position.coords.longitude}`);
            const data = await response.json();
            if (!response.ok) {
                throw await response.json();
            }
            setBuses(data.stops);
            for (let i = 0; i < data.stops.length; i++) {
                getBuses(
                    data.stops[i].routes.map(x => x.shortName),
                    data.stops[i].name,
                    data.stops[i].code
                )
            }
        } catch (err) {
            console.log(err);
        }
    }

    function mapNearby() {
        for (let i = 0; i < stations.length; i++) {
            getStations(
                stations[i].routes.replace(/\s/g, ''),
                stations[i].gtfs,
                stations[i].name,
                stations[i].geo
            );
        }
    }

    function mapNearbyBus() {
        for (let i = 0; i < buses.length; i++) {
            getBuses(
                buses[i].routes.map(x => x.shortName),
                buses[i].name,
                buses[i].code
            )
        }
    }
    
    function updateFavorites(name, geo) {
        setFavorites(favorites.filter(element => element.geo !== geo && element.name !== name));
    }

    function updateBusFavorites(name) {
        setBusFavorites(busFavorites.filter(element => element.name !== name));
    }

    useEffect(() => {
        if (!ignore && !nearbyStations) {
            mapFavorites();
            setIsLoading(false);
        } return () => {
            ignore = true;
        }
    }, []);

    useEffect(() => {
        if (!nearbyStations) {
        const interval = setInterval(() => {
          setFavorites([]);
          setBusFavorites([]);
          mapFavorites();
          setCurrent(((new Date).getTime()) /1000.00);
        }, 60000);
        return () => clearInterval(interval);
    } else {
        const interval = setInterval(() => {
            setFavorites([]);
            setBusFavorites([]);
            mapNearby();
            mapNearbyBus();
          }, 60000);
          return () => clearInterval(interval);
    }
      }, [getNearbyStations]);

    useEffect(() => {
        if (nearbyStations) {
            function successFunction(position) {
                setFavorites([]);
                setBusFavorites([]);
                getNearbyStations(position);
                getNearbyBusData(position);
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
    }, [nearbyStations]);

    if (favorites.length === 0 && busFavorites.length === 0) {
        return (
            <div className="flex flex-col self-center w-6/12 p-2 rounded-xl min-h-screen items-center text-center sm:w-full sm:rounded-none">
                No favorites saved
                <button className="p-4 bg-blue-500 text-white rounded-full font-bold" onClick={() => setNearbyStations(true)}>Check Nearby Stations</button>
            </div>
        )
    } else {
        return (
            <div className="flex flex-col self-center w-6/12 p-2 rounded-xl min-h-screen bg-slate-200 sm:w-full sm:rounded-none lg:w-fit">
                <div className="self-center py-2">
                    <button className="p-4 bg-blue-500 text-white rounded-full font-bold hover:scale-105 sm:p-2" onClick={() => setNearbyStations(true)}>Check Nearby Stations</button>
                </div>
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold text-center sm:text-xl">TRAINS</h1>
                    <div className="flex flex-col gap-2">
                    {favorites.map( (favorite, index) => {
                        return (
                            <div key={index} className="p-4 border-black border-t-2 sm:p-0"> 
                                <div className="flex flex-row items-center gap-2">
                                    <header className="text-xl font-bold sm:text-lg">{favorite.station}</header>
                                    <div className={nearbyStations ? "hidden" : "display"} onClick={() => {removeFromFavorites(favorite.station, favorite.geo); updateFavorites(favorite.station, favorite.geo) }}>
                                        <Image size={8} file={Favorited} img="Favorited"/>
                                    </div>
                                </div>
                                <ul className="flex flex-col gap-2">
                                    {Object.entries(favorite.alerts).map(([name, obj]) => ({name, ...obj})).map( (el, index) =>{
                                        return (
                                            <div key={index}>
                                                <Alert alert={el}/>
                                            </div>
                                        )
                                    })}
                                </ul>
                                <div className="flex flex-row justify-between sm:text-sm">
                                    <div className="p-4 w-full flex flex-col gap-2 sm:p-2 md:p-2">
                                        <header className="font-bold">Next Northbound</header> 
                                        <ul className={ isLoading ? "none" : "flex flex-col gap-4"}>
                                            {favorite.north.map( (el, index) => {
                                                return (
                                                    <div key={index}>
                                                        <Time el={el.stopTimeUpdate} train={el.trip.routeId} current={current} />
                                                    </div>
                                                )
                                            })}
                                        </ul>
                                    </div>
                                    <div className="p-4 w-full flex flex-col gap-2 sm:p-2 md:p-2">
                                        <header className="font-bold">Next Southbound</header> 
                                        <ul className={ isLoading ? "none" : "flex flex-col gap-4"}>
                                            {favorite.south.map ( (el, index) => {
                                                return (
                                                    <div key={index}>
                                                        <Time el={el.stopTimeUpdate} train={el.trip.routeId} current={current} />
                                                    </div>
                                                )
                                            })}
                                        </ul>
                                    </div>
                                </div>
                        </div>
                    )
                })}
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-center sm:text-xl">BUSES</h1>
                <div className="flex flex-col gap-6 p-4">
                    {busFavorites.map((bus, index) => {
                        return (
                            <ul key={index} className="flex flex-col gap-4 border-t-2 border-black py-4">
                                <div className="flex flex-row items-center gap-4">
                                    <h3 className="text-xl font-bold sm:text-sm">{bus.name}</h3>
                                    <div className={nearbyStations ? "hidden" : "display"} onClick={() => {removeFromBusFavorites(bus.name); updateBusFavorites(bus.name) }}>
                                        <Image size={8} file={Favorited} img="Favorited"/>
                                    </div>
                                </div>
                                {Object.entries(bus.alerts).map(([name, obj]) => ({name, ...obj})).map((alert, index) =>{
                                    return (
                                        <div key={index}>
                                            <BusAlert alert={alert} />
                                        </div>
                                    )
                                })}
                                {bus.times.map( (time, index) => {
                                    return (
                                        <div key={index}>
                                            <BusFavoriteTime current={current} time={time} index={index} bus={bus}/>
                                        </div>
                                    )
                                })}
                            </ul>
                        ) 
                    })}
                </div>
            </div>
        </div>
    )}
}

export default Home