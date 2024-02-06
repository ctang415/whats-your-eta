import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const Train = () => {
    const [stations, setStations] = useState([]);
    const params = useParams();
    let ignore = false;

    async function getStations() {
        console.log(params.trainid)
        try {
            const response = await fetch (`http://localhost:3000/trains/${params.trainid}`);
            const data = await response.json();
            setStations(data);
        } catch (err) {
            console.log(err);
        }
    }
    useEffect(() => {
        if (!ignore) {
            getStations();
        }
        return () => {
            ignore = true;
        }
    }, []);
    return (
        <>
        {stations.map(element => {
            return (
                <>
                {element.name}
                </>
            )
        })}
        </>
    )
}

export default Train