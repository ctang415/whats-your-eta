import { useState, useEffect } from "react";
import Time from "./time";
import Image from "./image";
import Favorite from "../assets/favorite.svg";

const Home = () => {
    const [favorites, setFavorites] = useState([]);
    const [color, setColor] = useState('');
    const [ isLoading, setIsLoading] = useState(true);
    let ignore = false;

  async function getStations(trains, station, name) {
        try {
            const response = await fetch (`http://localhost:3000/favorites/${trains}?station=${station}&name=${name}`);
            const data = await response.json();
            console.log(data);
            setFavorites(favorites =>[...favorites, data]);
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    }
    
    useEffect(() => {
        if (!ignore) {
            function mapFavorites() {
                for (let i = 0; i < localStorage.length; i++) {
                    getStations(
                        JSON.parse(Object.values(localStorage)[i]).route.replace(/\s/g, ''),
                        JSON.parse(Object.values(localStorage)[i]).id,
                        Object.keys(localStorage)[i]
                    );
                }
            }
            mapFavorites();
        } 
        return () => {
            ignore = true;
        }
    }, []);

    return (
        <div className="flex flex-col self-center w-6/12 p-2 rounded-xl min-h-screen bg-slate-200">
            {favorites.map(favorite => {
                return (
                    <div className="p-4"> 
                        <div className="flex flex-row items-center gap-2">
                            <header className="text-xl font-bold">{favorite.station}</header>
                            <div onClick={() => addToFavorites(element.name, element.routes, element.gtfs)}><Image size={8} file={Favorite} img="Favorite"/></div>
                        </div>
                        <div className="flex flex-row justify-between">
                            <div className="p-4 w-full flex flex-col gap-2">
                                <header className="font-bold">Next Northbound</header> 
                                <ul className={ isLoading ? "none" : "flex flex-col gap-4"}>
                                    {favorite.north.map( el => {
                                        return (
                                            <Time el={el.stopTimeUpdate} color={favorite.color} train={el.trip.routeId} />
                                        )
                                    })}
                                </ul>
                            </div>
                            <div className="p-4 w-full flex flex-col gap-2">
                                <header className="font-bold">Next Southbound</header> 
                                <ul className={ isLoading ? "none" : "flex flex-col gap-4"}>
                                    {favorite.south.map (el => {
                                        return (
                                            <Time el={el.stopTimeUpdate} color={favorite.color} train={el.trip.routeId} />
                                        )
                                    })}
                                </ul>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default Home