import { useEffect } from "react";
import { useState } from "react";

const BusSearchTime = ({times, code, stop, time, current}) => {

    if (time) {
        return (
            <ul>
                {times.map( (time, index) => {
                    return (
                        <li key={index} className={stop.shortName === code ? "display flex justify-between" : "hidden"}>
                            <p>{parseInt((time.stopTimeUpdate[0].arrival.time - parseInt(current))/60)} minutes away</p>
                            <p>{new Date(time.stopTimeUpdate[0].arrival.time * 1000).toLocaleTimeString()}</p>
                        </li>
                    )
                })}
            </ul>
        )
    }
}

export default BusSearchTime

