import Image from "./image";
import Favorite from "../assets/favorite.svg";
import { useEffect } from "react";
import { useState } from "react";

const Stop = ({element, north, south}) => {
    let ignore = false;
    const [current, setCurrent] = useState(((new Date).getTime()) /1000.00);
    const [northTimes, setNorthTimes] = useState([]);
    const [southTimes, setSouthTimes] = useState([]);
    useEffect(() => {
        if (!ignore) {
            let newNorth = north.filter(el => el.stopId.includes(element.gtfs)).sort(function (a,b) { return a.arrival.time - b.arrival.time});
            let newSouth = south.filter(el => el.stopId.includes(element.gtfs)).sort(function (a,b) {return a.arrival.time - b.arrival.time});
            setNorthTimes(newNorth);
            setSouthTimes(newSouth);
        } 
        return () => {
            ignore = true;
        }
    }, []);
    
    return (
        <li key={element.name}>
            <div className="flex flex-row items-center gap-2">
                <header className="text-xl font-bold">{element.name}</header>
                <Image size={8} file={Favorite} img="Favorite"/>
            </div>
            <div className="flex flex-row justify-between">
                <div>
                <header className="font-bold">Northbound</header> 
                <ul>
                    {northTimes.slice(0,5).map(el => {
                        return (
                            <li key={el.arrival.time}>
                                {new Date(el.arrival.time * 1000).toLocaleTimeString()}
                            </li>
                        )
                    })}
                </ul>
                </div>
                <div>
                <header className="font-bold">Southbound</header>
                <ul>
                    {southTimes.slice(0,5).map(el => {
                        return (                                
                            <li key={el.arrival.time}>
                                {new Date(el.arrival.time * 1000).toLocaleTimeString()}
                            </li>
                        )
                    })}
                </ul>
                </div>
            </div>
        </li>
    )
}
export default Stop