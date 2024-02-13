import { useState } from "react";
import { useContext } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Context } from "./context";
import Stop from "./stop";

const Train = () => {
    const params = useParams();
    const [stations, setStations] = useState([]);
    const [ north, setNorth] = useState([]);
    const [ south, setSouth] = useState([]);
    const [color, setColor] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    let ignore = false;

    async function getStations() {
        try {
            const response = await fetch (`http://localhost:3000/trains/${params.trainid}`).then(response => response.json());
            const responseTwo = await fetch (`http://localhost:3000/trains/${params.trainid}/times`).then(response => response.json());
            const [data, dataTwo] = await Promise.all([ response, responseTwo ]);
            console.log(data)
            setStations(data.routes);
            setNorth(dataTwo.north);
            setSouth(dataTwo.south);
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
        if (!ignore) {
            getStations();
            fetchTrains();
            setIsLoading(false);
        }
        return () => {
            ignore = true;
        }
    }, []);

    return (
        <div className="flex flex-col items-center p-4 gap-2">
            <header style={`${color}` !== '' ? ["N", "W", "Q", "R"].indexOf(`${params.trainid}`) < 0 ? {backgroundColor: `#${color}`, color: 'white', fontWeight: 'bold' } : {backgroundColor: `#${color}`, color: 'black', fontWeight: 'bold' } : 
            { color: 'black', fontWeight: "bold", backgroundColor: "white", border: "#D3D3D3 solid"}} className="rounded-full px-4 py-2 text-4xl font-bold">{params.trainid}</header>
            <ul className="w-6/12 p-2 rounded-xl min-h-screen bg-slate-200">
                {stations.map(element => {
                    return (
                        <Stop color={color} train={params.trainid} north={north} south={south} key={element.name} element={element}/>
                    )
                })}
            </ul>
        </div>
    )
}

export default Train