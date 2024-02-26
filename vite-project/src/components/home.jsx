import { useState, useEffect } from "react";
import Time from "./time";
import Image from "./image";
import Favorited from "../assets/filled_favorite.svg";
import { useContext } from "react";
import { Context } from "./context";
import Alert from "./alert";

const Home = () => {
    const [current, setCurrent] = useState(((new Date).getTime()) /1000.00);
    const [favorites, setFavorites] = useState([]);
    const [busFavorites, setBusFavorites] = useState([]);
    const [ isLoading, setIsLoading] = useState(true);
    const {removeFromFavorites, removeFromBusFavorites} = useContext(Context);
    const [nearbyStations, setNearbyStations] = useState(false);
    const [stations, setStations] = useState([]);
    let ignore = false;

  async function getStations(trains, station, name) {
        try {
            const response = await fetch (`http://localhost:3000/favorites/${trains}?station=${station}&name=${name}`);
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
            console.log(data)
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
                (x[i].name)
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
            setStations(data);
            for (let i = 0; i < data.length; i++) {
                getStations(
                    data[i].routes.replace(/\s/g, ''),
                    data[i].gtfs,
                    data[i].name
                );
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
                stations[i].name
            );
        }
    }
    
    function updateFavorites(name) {
        setFavorites(favorites.filter(element => element.station !== name))
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
          mapFavorites();
        }, 60000);
        return () => clearInterval(interval);
    } else {
        const interval = setInterval(() => {
            setFavorites([]);
            mapNearby();
          }, 60000);
          return () => clearInterval(interval);
    }
      }, []);

    useEffect(() => {
        if (nearbyStations) {
            function successFunction(position) {
                setFavorites([]);
                getNearbyStations(position);
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
            <div className="flex flex-col self-center w-6/12 p-2 rounded-xl min-h-screen items-center text-center">
                No favorites saved
                <button className="p-4 bg-blue-500 text-white rounded-full font-bold" onClick={() => setNearbyStations(true)}>Check Nearby Stations</button>
            </div>
        )
    } else {
    return (
        <div className="flex flex-col self-center w-6/12 p-2 rounded-xl min-h-screen bg-slate-200">
            <div className="self-center">
                <button className="p-4 bg-blue-500 text-white rounded-full font-bold hover:scale-105" onClick={() => setNearbyStations(true)}>Check Nearby Stations</button>
            </div>
            {favorites.map(favorite => {
                return (
                    <div className="p-4"> 
                        <div className="flex flex-row items-center gap-2">
                            <header className="text-xl font-bold">{favorite.station}</header>
                            <div className={nearbyStations ? "hidden" : "display"} onClick={() => {removeFromFavorites(favorite.station); updateFavorites(favorite.station) }}>
                                <Image size={8} file={Favorited} img="Favorited"/>
                            </div>
                        </div>
                        <ul className="flex flex-col gap-2">
                            {Object.entries(favorite.alerts).map(([name, obj]) => ({name, ...obj})).map(el =>{
                                return (
                                    <Alert alert={el}/>
                                )
                            })}
                        </ul>
                        <div className="flex flex-row justify-between">
                            <div className="p-4 w-full flex flex-col gap-2">
                                <header className="font-bold">Next Northbound</header> 
                                <ul className={ isLoading ? "none" : "flex flex-col gap-4"}>
                                    {favorite.north.map( el => {
                                        return (
                                            <Time el={el.stopTimeUpdate} train={el.trip.routeId} />
                                        )
                                    })}
                                </ul>
                            </div>
                            <div className="p-4 w-full flex flex-col gap-2">
                                <header className="font-bold">Next Southbound</header> 
                                <ul className={ isLoading ? "none" : "flex flex-col gap-4"}>
                                    {favorite.south.map (el => {
                                        return (
                                            <Time el={el.stopTimeUpdate} train={el.trip.routeId} />
                                        )
                                    })}
                                </ul>
                            </div>
                        </div>
                    </div>
                )
            })}
            <ul>
                {busFavorites.map(bus => {
                    return (
                        <li>
                            <h3>{bus.name}</h3>
                            {bus.times.map( (time, index) => {
                                return (
                                    <li key={index} className="display flex justify-between">
                                        <p>{parseInt((time.stopTimeUpdate[0].arrival.time - parseInt(current))/60)} minutes away</p>
                                        <p>{new Date(time.stopTimeUpdate[0].arrival.time * 1000).toLocaleTimeString()}</p>
                                    </li>
                                )
                            })}
                        </li>
                    ) 
                })}
            </ul>
        </div>
    )}
}

export default Home