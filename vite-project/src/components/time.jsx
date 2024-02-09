import { useState } from "react";

const Time = ({el, train, color}) => {
    const [current, setCurrent] = useState(((new Date).getTime()) /1000.00);
    
    if (el.arrival && parseInt((el.arrival.time - parseInt(current))/60) >= 0) {
        return (
            <li key={el.arrival.time} className="flex flex-row justify-between ">
                <div className="flex gap-2 items-center">
                    <p style={`${color}` !== '' ? ["N", "W", "Q", "R"].indexOf(`${train}`) < 0 ? {backgroundColor: `#${color}`, color: 'white', fontWeight: 'bold' } : {backgroundColor: `#${color}`, color: 'black', fontWeight: 'bold' } : { color: 'black', fontWeight: "bold", backgroundColor: "white", border: "#D3D3D3 solid"}} className="bg-slate-100 rounded-full px-3 py-1">{train}</p> 
                    <p className="">{parseInt((el.arrival.time - parseInt(current))/60)} minutes away</p> 
                </div>
                <p>{new Date(el.arrival.time * 1000).toLocaleTimeString()}</p>
        </li>
        )
    }
}

export default Time