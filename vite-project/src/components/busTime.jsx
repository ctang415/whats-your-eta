import { useState } from "react";

const BusTime = ({busTimes, bus}) => {
    const [current, setCurrent] = useState(((new Date).getTime()) /1000.00);

    return (
        <ul className="display flex flex-col gap-1 p-2 rounded-md bg-slate-300">
            {busTimes.map( (time, index) => {
                return (
                    <li key={index} className={time.stopTimeUpdate[0].stopId == bus.code ? "display flex justify-between" : "hidden"}>
                        <p>{parseInt((time.stopTimeUpdate[0].arrival.time - parseInt(current))/60)} minutes away</p>
                        <p>{new Date(time.stopTimeUpdate[0].arrival.time * 1000).toLocaleTimeString()}</p>
                    </li>
                )
            })}
        </ul>
    )
}

export default BusTime