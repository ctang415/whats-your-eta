import { useEffect, useState } from "react"
import { Link } from "react-router-dom";

const Trains = () => {
    const [trains, setTrains] = useState([]);
    let ignore = false;
    async function fetchTrains() {
        try {
            const response = await fetch ('http://localhost:3000/trains');
            const data = await response.json();
            function groupBy(xs, key) {
                return xs.reduce(function(rv, x) {
                  (rv[x[key]] = rv[x[key]] || []).push(x);
                  return rv;
                }, {});
              };
            setTrains(Object.values(groupBy(Object.values(data), 'color')));
        } catch (err) {
        console.log(err);
        }
    }    
    
    useEffect(() => {
        if(!ignore) {
            fetchTrains();
        }
        return () => {
            ignore = true;
        }
    }, [])

    return (
        <div>
            <h3 className="text-4xl font-medium ">Trains</h3>
            <div className="flex flex-col gap-1">
                {trains.map( (x, index) => {
                    return (
                        <div className="flex flex-row gap-1.5" key={index}>
                            {x.map((train, index) => {
                                return (
                                    <Link to={`/trains/${train.name}`} key={index} className="w-fit h-fit flex">
                                        <div className="rounded-full items-center justify-center px-4 py-2 flex"
                                        style={ `${train.color}` !== '' ? {backgroundColor: `#${train.color}`, color: 'white', fontWeight: 'bold'} : { color: 'black', fontWeight: "bold", backgroundColor: "white", border: "#D3D3D3 solid"}}>{train.name}</div>
                                    </Link>
                                )
                            })}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Trains