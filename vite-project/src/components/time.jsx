import { useContext, useEffect } from "react";
import { useState } from "react";
import { Context } from "./context";

const Time = ({el, train}) => {
    const {trains} = useContext(Context);
    const [current, setCurrent] = useState(((new Date).getTime()) /1000.00);
    //const [color, setColor] = useState(trains.flat().find(x => x.name == train).color);
    const [ color, setColor] = useState('')
    let ignore = false;

    if (el.arrival && el.departure && parseInt((el.arrival.time - parseInt(current))/60) >= 0) {
        return (
            <li key={el.arrival.time} className="flex flex-row justify-between">
                <div className="flex gap-2 items-center">
                    <p style={`${color}` !== '' ? ["N", "W", "Q", "R"].indexOf(`${train}`) < 0 ? {backgroundColor: `#${color}`, color: 'white', fontWeight: 'bold' } : {backgroundColor: `#${color}`, color: 'black', fontWeight: 'bold' } : { color: 'black', fontWeight: "bold", backgroundColor: "white", border: "#D3D3D3 solid"}} className="bg-slate-100 rounded-full px-3 py-1">{train}</p> 
                    <p>{parseInt((el.arrival.time - parseInt(current))/60)} minutes away</p> 
                </div>
                <p>{new Date(el.arrival.time * 1000).toLocaleTimeString()}</p>
        </li>
        )
    } else if (!el.departure && parseInt((el.arrival.time - parseInt(current))/60) >= 0 ) {
        return (
            <li key={el.arrival.time} className="flex flex-row justify-between">
                <div className="flex gap-2 items-center">
                    <p style={`${color}` !== '' ? ["N", "W", "Q", "R"].indexOf(`${train}`) < 0 ? {backgroundColor: `#${color}`, color: 'white', fontWeight: 'bold' } : {backgroundColor: `#${color}`, color: 'black', fontWeight: 'bold' } : { color: 'black', fontWeight: "bold", backgroundColor: "white", border: "#D3D3D3 solid"}} className="bg-slate-100 rounded-full px-3 py-1">{train}</p> 
                    <p>{parseInt((el.arrival.time - parseInt(current))/60)} minutes away</p> 
                </div>
                <p>{new Date(el.arrival.time * 1000).toLocaleTimeString()}</p>
        </li>
        )
    } else if (!el.arrival && parseInt((el.departure.time - parseInt(current))/60) >= 0) {
        return (
            <li key={el.departure.time} className="flex flex-row justify-between">
                <div className="flex gap-2 items-center">
                    <p style={`${color}` !== '' ? ["N", "W", "Q", "R"].indexOf(`${train}`) < 0 ? {backgroundColor: `#${color}`, color: 'white', fontWeight: 'bold' } : {backgroundColor: `#${color}`, color: 'black', fontWeight: 'bold' } : { color: 'black', fontWeight: "bold", backgroundColor: "white", border: "#D3D3D3 solid"}} className="bg-slate-100 rounded-full px-3 py-1">{train}</p> 
                    <p>{parseInt((el.departure.time - parseInt(current))/60)} minutes away</p> 
                </div>
                <p>{new Date(el.departure.time * 1000).toLocaleTimeString()}</p>
        </li>
        )
    }
}

export default Time