import Image from "./image";
import Favorite from "../assets/favorite.svg";
import { useEffect } from "react";
import { useState } from "react";
import Time from "./time";

const Stop = ({element, north, south, train, color}) => {
    let ignore = false;
    const [northTimes, setNorthTimes] = useState([]);
    const [southTimes, setSouthTimes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    function addToFavorites(name, trains, stop) {
       //localStorage.clear()
        localStorage.setItem(`${name}`, JSON.stringify({route: trains, id: stop}));
    }

    useEffect(() => {
        if (!ignore) {
           let newNorth = north.filter(el => el.stopId.includes(element.gtfs)).sort( function (a,b) { 
                if (a.arrival && b.arrival) {
                    return a.arrival.time - b.arrival.time } 
                });
            let newSouth = south.filter(el => el.stopId.includes(element.gtfs)).sort( function (a,b) { 
                if (a.arrival && b.arrival) {
                    return a.arrival.time - b.arrival.time } 
                });
            setNorthTimes(newNorth);
            setSouthTimes(newSouth);
            setIsLoading(false);
        }
        return () => {
            ignore = true;
        }
    }, []);

    return (
        <li key={element.name} className="p-4">
            <div className="flex flex-row items-center gap-2">
                <header className="text-xl font-bold">{element.name}</header>
                <div onClick={() => addToFavorites(element.name, element.routes, element.gtfs)}><Image size={8} file={Favorite} img="Favorite"/></div>
            </div>
            <div className="flex flex-row justify-between">
                <div className="p-4 w-full flex flex-col gap-2">
                    <header className="font-bold">Next Northbound</header> 
                    <ul className={ isLoading ? "none" : "flex flex-col gap-4"}>
                        {northTimes.slice(0,2).map(el => {
                            return (
                                <Time el={el} train={train} color={color}/>
                            )
                        })}
                    </ul>
                </div>
                <div className="p-4 w-full flex flex-col gap-2">
                    <header className="font-bold">Next Southbound</header>
                    <ul className={ isLoading ? "none" : "flex flex-col gap-4"}>
                        {southTimes.slice(0,2).map(el => {
                            return (
                                <Time el={el} train={train} color={color}/>
                            )
                        })}
                    </ul>
                </div>
            </div>
        </li>
    )
}
export default Stop