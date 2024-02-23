import { useEffect } from "react";
import { useState } from "react"
import BusSearchTime from "./busSearchTime";

const BusStops = ({bus, search}) => {
    const [routes, setRoutes] = useState(false);
    const [time, setTime] = useState(false);
    const [times, setTimes] = useState([]);
    const [code, setCode] = useState('');

    async function searchRoute(stopId, busId) {
        try {
            const response = await fetch (`http:///localhost:3000/buses/${search}?stop=${stopId}&bus=${busId}`);
            if (!response.ok) {
                throw await response.json();
            }
            const data = await response.json();
            setTimes(data);
            setTime(true);
        } catch (err) {
            console.log(err);
        }
    }


    return (
        <li className="flex flex-col gap-1 p-2 rounded-md bg-slate-300" key={bus.code}>
            <p onClick={() => {setRoutes(!routes); setTime(false)}} className="font-bold cursor-pointer">{bus.name}</p>
            <div>
                {bus.routes.map((stop, index) => {
                    return (
                        <div>
                            <div onClick={() => {searchRoute(bus.code, stop.shortName); setCode(stop.shortName)}} key={index} className={routes ? "display flex gap-2 cursor-pointer" : "hidden"}>
                                <p className="font-semibold">{stop.shortName}</p> 
                                <p>{stop.longName}</p>
                            </div>
                            <BusSearchTime time={time} stop={stop} code={code} times={times}/>
                        </div>
                    )
                })}
            </div>
        </li>
    )
}

export default BusStops