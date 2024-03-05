import BusRoutes from "./busRoutes";

const BusStops = ({stop, search, buses}) => {

    return (
        stop.stopIds.map( (bus, index) => {
            return (
                <div key={index}>
                    <BusRoutes search={search} bus={bus} buses={buses}/>
                </div>
            )
        })
    )
}

export default BusStops