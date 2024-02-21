import { useEffect } from "react";
import { useState } from "react"

const Alert = ({alert}) => {
    const [display, setDisplay] = useState(false);
    const [color, setColor] = useState('')
    let ignore = false;
    
    useEffect(() => {
        if (!ignore) {
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
              setColor(Object.values(groupBy(Object.values(data), 'color')).flat().find(el => el.name == alert.name).color);
            } catch (err) {
                console.log(err);
            }
        }
        fetchTrains();
    }
    return () => {
        ignore = true;
    }
    }, [])

    return (
        <li className="flex flex-col gap-2">
            <div className="flex flex-row bg-slate-300 p-2 rounded-md gap-1 items-center font-bold cursor-pointer" onClick={() => setDisplay(!display)}>
                <h3 className="px-3 py-1 rounded-full"
                style={`${color}` !== '' ? ["N", "W", "Q", "R", "6X"].indexOf(`${alert.name}`) < 0 ? {backgroundColor: `#${color}`, color: 'white', fontWeight: 'bold' } : {backgroundColor: `#${color}`, color: 'black', fontWeight: 'bold' } : { color: 'black', fontWeight: "bold", backgroundColor: "white", border: "#D3D3D3 solid"}}>{alert.name}</h3>
                <div>{Object.values(alert).length-1}</div>
                <div className={ Object.values(alert).length-1 !== 1 ? "display" : "hidden"}>alerts</div>
                <div className={ Object.values(alert).length-1 == 1 ? "display" : "hidden"}>alert</div>
            </div>
            {Object.values(alert).slice(0,-1).map(ob => {
                return (
                    <div className={ display ? "display bg-slate-300 p-2 rounded-md" : "hidden"} key={ob}>
                        {ob}
                    </div>
                )
            })}
        </li>
    )
}

export default Alert