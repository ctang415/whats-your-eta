import { useState } from "react";

const BusAlert = ({alert}) => {

    const [display, setDisplay] = useState(false);
    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-row items-center gap-1 bg-slate-300 p-2 rounded-md font-bold cursor-pointer" onClick={() => setDisplay(!display)}>
            <h3 className="text-center font-bold bg-blue-700 text-white px-3 py-1 rounded-full">{alert.name}</h3>
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
        </div>
    )
}

export default BusAlert