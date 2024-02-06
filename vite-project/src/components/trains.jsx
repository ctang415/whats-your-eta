import { useEffect, useState } from "react"
import { Link } from "react-router-dom";

const Trains = () => {
    const [trains, setTrains] = useState([]);
    let ignore = false;
    async function fetchTrains() {
        try {
            const response = await fetch ('http://localhost:3000/trains');
            const data = await response.json();
            console.log(data)
            setTrains(Object.values(data));
        } catch (err) {
        console.log(err);
        }
    }    
    
    useEffect(() => {
        if(!ignore) {
            fetchTrains();
        }
        return () => {
            ignore = true;
        }
    }, [])

    return (
        <div>
            {trains.map( (train, index) => {
                return (
                    <Link to={`/trains/${train.name}`} key={index}>
                        <div style={ `${train.color}` !== '' ? {backgroundColor: `#${train.color}`, color: 'white', fontWeight: 'bold'} : { color: 'black', fontWeight: "bold"}}>{train.name}</div>
                    </Link>
                )
            })}
        </div>
    )
}

export default Trains