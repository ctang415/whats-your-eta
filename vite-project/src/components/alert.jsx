import { useState } from "react"

const Alert = ({alert}) => {
    const [display, setDisplay] = useState(false);

    return (
        <li className="flex flex-col gap-2">
            <div className="flex flex-row bg-slate-300 p-2 rounded-md gap-1" onClick={() => setDisplay(!display)}>
                <h3>{alert.name}</h3> 
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