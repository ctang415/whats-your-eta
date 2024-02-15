import { useState, useEffect } from "react";
import Time from "./time";
import Image from "./image";
import Favorited from "../assets/filled_favorite.svg";
import { useContext } from "react";
import { Context } from "./context";

const Home = () => {
    const [favorites, setFavorites] = useState([]);
    const [ isLoading, setIsLoading] = useState(true);
    const {removeFromFavorites} = useContext(Context);
    const [nearbyStations, setNearbyStations] = useState(false);
    const [stations, setStations] = useState([]);
    let ignore = false;

  async function getStations(trains, station, name) {
        try {
            const response = await fetch (`http://localhost:3000/favorites/${trains}?station=${station}&name=${name}`);
            const data = await response.json();
            setFavorites(favorites =>[...favorites, data]);
            console.log(data)
        } catch (err) {
            console.log(err);
        }
    }
    function mapFavorites() {
        for (let i = 0; i < localStorage.length; i++) {
            getStations(
                JSON.parse(Object.values(localStorage)[i]).route.replace(/\s/g, ''),
                JSON.parse(Object.values(localStorage)[i]).id,
                Object.keys(localStorage)[i]
            );
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
      }, [])

    useEffect(() => {
        if (nearbyStations) {
            function successFunction(position) {
                console.log(position);
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
    }, [nearbyStations])


    if (favorites.length === 0) {
        return (
            <div className="text-center">
                No favorites saved
                <button onClick={() => setNearbyStations(true)}>Check Nearby Stations</button>
            </div>
        )
    } else {
    return (
        <div className="flex flex-col self-center w-6/12 p-2 rounded-xl min-h-screen bg-slate-200">
            {favorites.map(favorite => {
                return (
                    <div className="p-4"> 
                        <div className="flex flex-row items-center gap-2">
                            <header className="text-xl font-bold">{favorite.station}</header>
                            <div className={nearbyStations ? "hidden" : "display"} onClick={() => {removeFromFavorites(favorite.station); updateFavorites(favorite.station) }}>
                                <Image size={8} file={Favorited} img="Favorited"/>
                            </div>
                        </div>
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
        </div>
    )}
}

export default Home