import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Stop from "./stop";

const Train = () => {
    const [stations, setStations] = useState([]);
    const [ north, setNorth] = useState([]);
    const [ south, setSouth] = useState([]);
    const params = useParams();
    let ignore = false;

    async function getStations() {
        try {
            const response = await fetch (`http://localhost:3000/trains/${params.trainid}`);
            const data = await response.json();
            setStations(data.routes);
        } catch (err) {
            console.log(err);
        }
    }

    async function getTimes() {
        try {
            const response = await fetch (`http://localhost:3000/trains/${params.trainid}/times`);
            const data = await response.json();
            console.log(data)
            setNorth(data.north);
            setSouth(data.south);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        if (!ignore) {
            getStations();
            getTimes();
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
                        <Stop north={north} south={south} key={element.name} element={element}/>
                    )
                })}
            </ul>
        </div>
    )
}

export default Train