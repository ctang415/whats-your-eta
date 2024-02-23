import BusTime from "./busTime"

const Bus = ({bus, busTimes}) => {

    return (
        <li className="flex flex-col p-4 gap-2" key={bus.code}>
            <h3 className="font-bold text-xl">STOP: {bus.name}</h3>
                {bus.routes.map(route => {
                    return (
                        <div className="p-2 rounded-md" style={{ backgroundColor: `#${route.color}`, color: `#${route.textColor}`}}>
                            <p>{route.longName}</p>
                            <p>{route.shortName}</p>
                        </div>
                )
            })}
            <BusTime bus={bus} busTimes={busTimes}/>
        </li>
    )
}

export default Bus