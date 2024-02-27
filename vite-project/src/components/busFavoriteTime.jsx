const BusFavoriteTime = ({time, index, current, bus}) => {

    return (
        <li key={index} className="px-4 flex items-center justify-between">
            <div className="flex flex-row items-center gap-2">
                <p className="w-16 text-center font-bold rounded-full bg-blue-700 text-white py-1 px-3">{time.trip.routeId}</p>
                <p>{parseInt((time.stopTimeUpdate[0].arrival.time - parseInt(current))/60)} minutes away</p>
            </div>
            <p>{new Date(time.stopTimeUpdate[0].arrival.time * 1000).toLocaleTimeString()}</p>
        </li>
    )
}

export default BusFavoriteTime