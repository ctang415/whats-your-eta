import { useEffect } from "react";
import { useContext } from "react";
import { useState } from "react";
import BusSearchTime from "./busSearchTime";
import { Context } from "./context";
import Image from "./image";
import Favorite from "../assets/favorite.svg";
import Favorited from "../assets/filled_favorite.svg";

const BusRoutes = ({bus, search}) => {
    const [current, setCurrent] = useState(((new Date).getTime()) /1000.00);
    const [routes, setRoutes] = useState(false);
    const [time, setTime] = useState(false);
    const [times, setTimes] = useState([]);
    const [code, setCode] = useState('');
    const [stopId, setStopId] = useState('');
    const [busId, setBusId] = useState('');
    const {removeFromBusFavorites, busList, setBusList} = useContext(Context);

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

    function addToFavorites(buses, stop, code) {
        if (localStorage.getItem("buses") == undefined) {
            localStorage.setItem("buses", JSON.stringify([{buses: buses, stop: stop, code: code}]));
            setBusList(JSON.parse(localStorage.getItem("buses")));
        } else {
            let x = JSON.parse(localStorage.getItem("buses"));
            if (x.find(e => e.code == code) == undefined) {
                x.push({buses: buses, stop: stop, code: code});
                localStorage.setItem("buses", JSON.stringify(x));
                setBusList(x);
            }
        }
        setBusList(JSON.parse(localStorage.getItem("buses")));
    }

    useEffect(() => {
        const interval = setInterval(() => {
            if (stopId !== '' && busId !== '') {
                setTime(false);
                searchRoute(stopId, busId);
                setCurrent(((new Date).getTime()) /1000.00);
            }
        }, 60000);
        return () => clearInterval(interval);
    }, [stopId]);

    return (
        <li className="flex flex-col gap-1 p-2 rounded-md bg-slate-300 sm:text-sm" key={bus.code}>
            <div className="flex flex-row gap-2">
                <p onClick={() => {setRoutes(!routes); setTime(false); setStopId(''); setBusId(''); setCode('')}} className="font-bold cursor-pointer">{bus.name}</p>
                <div className={busList && busList.some( y => y.stop == bus.name) ? "hidden" : "display"} onClick={() => addToFavorites(bus.routeIds, bus.name, bus.code)}>
                    <Image size={8} file={Favorite} img="Favorite"/>
                </div>
                <div className={ busList && busList.some( y => y.stop == bus.name) ? "display" : "hidden"}  onClick={() => removeFromBusFavorites(bus.name)}>
                    <Image size={8} file={Favorited} img="Favorited"/>
                </div>
            </div>
            <div className="flex flex-col gap-2">
                {bus.routeIds.map((stop, index) => {
                    return (
                        <div key={index} className="flex flex-col gap-4">
                            <div onClick={() => {setStopId(bus.code); setBusId(stop.shortName); setCode(stop.shortName); searchRoute(bus.code, stop.shortName)}} className={routes ? "display flex gap-2 cursor-pointer bg-blue-700 text-white rounded-md p-2" : "hidden"}>
                                <p className="font-semibold">{stop.shortName}</p> 
                                <p>{stop.longName}</p>
                            </div>
                            <BusSearchTime current={current} time={time} stop={stop} code={code} times={times}/>
                        </div>
                    )
                })}
            </div>
        </li>
    )
}

export default BusRoutes