import Image from "./image";
import Favorite from "../assets/favorite.svg";
import Favorited from "../assets/filled_favorite.svg";
import { useEffect } from "react";
import { useState } from "react";
import Time from "./time";
import { useParams } from "react-router-dom";
import { useContext } from "react";
import { Context } from './context';

const Stop = ({element, train, color}) => {
    let ignore = false;
    const [northTimes, setNorthTimes] = useState([]);
    const [southTimes, setSouthTimes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const {removeFromFavorites, list, setList} = useContext(Context);
    const params = useParams();
    
    function addToFavorites(name, trains, stop, stationId, geo) {
        if (localStorage.getItem("trains") == undefined) {
            localStorage.setItem("trains", JSON.stringify([{name: name, route: trains, id: stop, station_id: stationId, geo: geo }]));
            let x = JSON.parse(localStorage.getItem("trains"));
            setList(x);
        } else {
            let x = JSON.parse(localStorage.getItem("trains"));
            if (x.find(el => el.name == name && el.geo == geo) == undefined) {
                x.push({name:name, route: trains, id: stop, station_id: stationId, geo: geo})
                localStorage.setItem("trains", JSON.stringify(x));
            }
            setList(x);
        }
    }

    async function getTimes() {
        try {
            const response = await fetch (`http://localhost:3000/trains/${params.trainid}/times/${element.gtfs}`);
            const data = await response.json();
            setNorthTimes(data.north);
            setSouthTimes(data.south);
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        if (!ignore) {
            getTimes();
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
                <div className={ list && list.some( y => y.name == element.name && y.geo == element.geo) ? "hidden" : "display"} onClick={() => addToFavorites(element.name, element.routes, element.gtfs, element.station_id, element.geo)}>
                    <Image size={8} file={Favorite} img="Favorite"/>
                </div>
                <div className={ list && list.some( y=> y.name == element.name && y.geo == element.geo) ? "display" : "hidden" } onClick={() => removeFromFavorites(element.name, element.geo)}>
                    <Image size={8} file={Favorited} img="Favorited"/>
                </div>
            </div>
            <div className="flex flex-row justify-between">
                <div className="p-4 w-full flex flex-col gap-2">
                    <header className="font-bold">Next Northbound</header> 
                    <ul className={ isLoading ? "none" : "flex flex-col gap-4"}>
                        {northTimes.length !== 0 ? northTimes.map(el => {
                            return (
                                <Time el={el} color={color} train={train}/>
                            )
                        }) : <p>No Trains Available</p>}
                    </ul>
                </div>
                <div className="p-4 w-full flex flex-col gap-2">
                    <header className="font-bold">Next Southbound</header>
                    <ul className={ isLoading ? "none" : "flex flex-col gap-4"}>
                        {southTimes.length !== 0 ? southTimes.map(el => {
                            return (
                                <Time el={el} color={color} train={train}/>
                            )
                        }) : <p>No Trains Available</p> }
                    </ul>
                </div>
            </div>
        </li>
    )
}
export default Stop