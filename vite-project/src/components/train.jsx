import { useState } from "react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Stop from "./stop";

const Train = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [stations, setStations] = useState([]);
    const [color, setColor] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    let ignore = false;

    async function getStations() {
        try {
            const response = await fetch (`http://localhost:3000/trains/${params.trainid}`);
            const data  = await response.json();
            setStations(data.routes);
        } catch (err) {
            console.log(err);
        }
    }

    async function fetchTrains() {
        try {
            const response = await fetch ('http://localhost:3000/trains');
            const data = await response.json();
            function groupBy(obj, key) {
                return obj.reduce(function(rv, x) {
                  (rv[x[key]] = rv[x[key]] || []).push(x);
                  return rv;
                }, {});
              };
            setColor(Object.values(groupBy(Object.values(data), 'color')).flat().find(x => x.name == params.trainid).color);
        } catch (err) {
          console.log(err);
        }
    }

    useEffect(() => {
        if (params.trainid === params.trainid.toLowerCase()) {
            let uppercase = params.trainid.toUpperCase();
            navigate(`/trains/${uppercase}`);
        }
    }, [])

    useEffect(() => {
        if (!ignore) {
            getStations();
            fetchTrains();
            setIsLoading(false);
        }
        return () => {
            ignore = true;
        }
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            getStations();
        }, 60000);
        return () => clearInterval(interval);
    }, [])

    return (
        <div className="flex flex-col items-center p-4 gap-2 sm:p-0 sm:gap-0">
            <header style={`${color}` !== '' ? ["N", "W", "Q", "R"].indexOf(`${params.trainid}`) < 0 ? {backgroundColor: `#${color}`, color: 'white', fontWeight: 'bold' } : {backgroundColor: `#${color}`, color: 'black', fontWeight: 'bold' } : 
            { color: 'black', fontWeight: "bold", backgroundColor: "white", border: "#D3D3D3 solid"}} className="rounded-full px-4 py-2 text-4xl font-bold">{params.trainid}</header>
            <ul className="w-6/12 p-2 rounded-xl min-h-screen bg-slate-200 sm:w-full sm:rounded-none lg:w-fit">
                {stations.map(element => {
                    return (
                        <Stop train={params.trainid} color={color} key={element.name} element={element}/>
                    )
                })}
            </ul>
        </div>
    )
}

export default Train