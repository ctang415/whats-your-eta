import { useState } from "react";
import { useContext } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Context } from "./context";
import Image from "./image";
import Favorite from "../assets/favorite.svg";

const Train = () => {
    const {trains} = useContext(Context);
    const [stations, setStations] = useState([]);
    const params = useParams();
    let ignore = false;

    async function getStations() {
        try {
            const response = await fetch (`http://localhost:3000/trains/${params.trainid}`);
            const data = await response.json();
            setStations(data);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        const url = [
            "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-ace", "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-bdfm",
            "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-g", "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-jz",
            "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-nqrw", "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-l",
            "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs", "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-si"
        ]
        let x = url.map(el => el.split('gtfs-'))
        console.log(x)
        function test() {
            let hash = {};
            
        }

    }, [])

    useEffect(() => {
        if (!ignore) {
            getStations();
        }
        return () => {
            ignore = true;
        }
    }, []);


    return (
        <div className="flex flex-col items-center">
            <header className="text-4xl font-bold">{params.trainid}</header>
            <ul>
                {stations.map(element => {
                    return (
                        <li key={element.name}>
                            <div className="flex flex-row items-center gap-2">
                                <header className="text-xl font-bold">{element.name}</header>
                                <Image size={8} file={Favorite} img="Favorite"/>
                            </div>
                            <div className="flex flex-row justify-between">
                                <header>Northbound</header>
                                <header>Southbound</header>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default Train