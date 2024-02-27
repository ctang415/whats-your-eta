const BusSearchTime = ({times, code, stop, time, current}) => {

    if (time) {
        return (
            <ul className="flex flex-col gap-2">
                {times.map( (time, index) => {
                    return (
                        <li key={index} className={stop.shortName === code ? "display flex justify-between bg-white rounded-md p-2" : "hidden"}>
                            <p>{parseInt((time.stopTimeUpdate[0].arrival.time - parseInt(current))/60)} minutes away</p>
                            <p>{new Date(time.stopTimeUpdate[0].arrival.time * 1000).toLocaleTimeString()}</p>
                        </li>
                    )
                })}
            </ul>
        )
    }
}

export default BusSearchTime

