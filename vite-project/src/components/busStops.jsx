import { useState } from "react"

const BusStops = ({bus}) => {
    const [routes, setRoutes] = useState(false);

    return (
        <li className="text-decoration" key={bus.code}>
            {bus.name}
            <div>{bus.routes.map(stop => {
                return (
                    <p>{stop.shortName}/{stop.longName}</p>
                )
            })}</div>
        </li>
    )
}

export default BusStops