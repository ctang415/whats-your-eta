import { useContext } from "react";
import { useEffect } from "react"
import { Link } from "react-router-dom";
import { Context } from "./context";

const Trains = () => {
    const {trains, setTrains, fetchTrains} = useContext(Context);
    let ignore = false;

    useEffect(() => {
        if(!ignore) {
            fetchTrains();
        }
        return () => {
            ignore = true;
        }
    }, [])

    return (
        <div className="flex flex-col items-center gap-4 p-4">
            <h3 className="text-4xl font-bold">Trains</h3>
            <div className="flex flex-col gap-3">
                {trains.map( (x, index) => {
                    return (
                        <div className="flex flex-row gap-1" key={index}>
                            {x.map((train, index) => {
                                return (
                                    <Link to={`/trains/${train.name}`} key={index} className="w-fit h-fit flex hover:scale-110">
                                        <div className="rounded-full items-center justify-center px-4 py-2 flex"
                                        style={ `${train.color}` !== '' ? 
                                         ["N", "W", "Q", "R"].indexOf(`${train.name}`) < 0 ? {backgroundColor: `#${train.color}`, color: 'white', fontWeight: 'bold' } : {backgroundColor: `#${train.color}`, color: 'black', fontWeight: 'bold' } : 
                                        { color: 'black', fontWeight: "bold", backgroundColor: "white", border: "#D3D3D3 solid"}}>{train.name}</div>
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