import { useContext, useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Context } from "./context";

const Time = ({el, color, train}) => {
    const params = useParams();
    const [current, setCurrent] = useState(((new Date).getTime()) /1000.00);
    const [ homeColor, setHomeColor] = useState('')
    let ignore = false;

    useEffect(() => {
        if (!ignore) {
            if (!params.trainid) {
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
                      setHomeColor(Object.values(groupBy(Object.values(data), 'color')).flat().find(el => el.name == train).color);
                    } catch (err) {
                        console.log(err);
                    }
                }
                fetchTrains();
            }
        }
        return () => {
            ignore = true;
        }
    }, []);

    if(!params.trainid) {
        if (el.arrival && el.departure && parseInt((el.arrival.time - parseInt(current))/60) >= 0) {
            return (
                <li key={el.arrival.time} className="flex flex-row justify-between">
                    <div className="flex gap-2 items-center">
                        <p style={`${homeColor}` !== '' ? ["N", "W", "Q", "R", "6X"].indexOf(`${train}`) < 0 ? {backgroundColor: `#${homeColor}`, color: 'white', fontWeight: 'bold' } : {backgroundColor: `#${homeColor}`, color: 'black', fontWeight: 'bold' } : { color: 'black', fontWeight: "bold", backgroundColor: "white", border: "#D3D3D3 solid"}} className="bg-slate-100 rounded-full px-3 py-1">{train}</p> 
                        <p>{parseInt((el.arrival.time - parseInt(current))/60)} minutes away</p> 
                    </div>
                    <p>{new Date(el.arrival.time * 1000).toLocaleTimeString()}</p>
            </li>
            )
        } else if (!el.departure && parseInt((el.arrival.time - parseInt(current))/60) >= 0 ) {
            return (
                <li key={el.arrival.time} className="flex flex-row justify-between">
                    <div className="flex gap-2 items-center">
                        <p style={`${homeColor}` !== '' ? ["N", "W", "Q", "R", "6X"].indexOf(`${train}`) < 0 ? {backgroundColor: `#${homeColor}`, color: 'white', fontWeight: 'bold' } : {backgroundColor: `#${homeColor}`, color: 'black', fontWeight: 'bold' } : { color: 'black', fontWeight: "bold", backgroundColor: "white", border: "#D3D3D3 solid"}} className="bg-slate-100 rounded-full px-3 py-1">{train}</p> 
                        <p>{parseInt((el.arrival.time - parseInt(current))/60)} minutes away</p> 
                    </div>
                    <p>{new Date(el.arrival.time * 1000).toLocaleTimeString()}</p>
            </li>
            )
        } else if (!el.arrival && parseInt((el.departure.time - parseInt(current))/60) >= 0) {
            return (
                <li key={el.departure.time} className="flex flex-row justify-between">
                    <div className="flex gap-2 items-center">
                        <p style={`${color}` !== '' ? ["N", "W", "Q", "R", "6X"].indexOf(`${train}`) < 0 ? {backgroundColor: `#${homeColor}`, color: 'white', fontWeight: 'bold' } : {backgroundColor: `#${homeColor}`, color: 'black', fontWeight: 'bold' } : { color: 'black', fontWeight: "bold", backgroundColor: "white", border: "#D3D3D3 solid"}} className="bg-slate-100 rounded-full px-3 py-1">{train}</p> 
                        <p>{parseInt((el.departure.time - parseInt(current))/60)} minutes away</p> 
                    </div>
                    <p>{new Date(el.departure.time * 1000).toLocaleTimeString()}</p>
            </li>
            )
        }
    }
    else {
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
}

export default Time