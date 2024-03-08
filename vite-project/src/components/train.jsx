import { useState } from "react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Stop from "./stop";
import InfiniteScroll from 'react-infinite-scroll-component';

const Train = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [stations, setStations] = useState([]);
    const [color, setColor] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const [counter, setCounter] = useState(0);
    const increase = 5;
    let ignore = false;

    async function getStations() {
        try {
            const response = await fetch (`http://localhost:3000/trains/${params.trainid}?page=${counter}&limit=${increase}`);
            const data  = await response.json();
            setStations(stations.concat(data.routes));
            setCounter(counter+1);
            if (counter >= (data.length/increase) + 1) {
                setHasMore(false)
            }
        }  catch (err) {
            console.log(err);
        } 
    }

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
            setColor(Object.values(groupBy(Object.values(data), 'color')).flat().find(x => x.name == params.trainid).color);
        } catch (err) {
          console.log(err);
        }
    }

    useEffect(() => {
        if (params.trainid === params.trainid.toLowerCase()) {
            let uppercase = params.trainid.toUpperCase();
            navigate(`/trains/${uppercase}`);
        }
    }, []);

    useEffect(() => {
        if (!ignore) {
            getStations();
            fetchTrains();
            setIsLoading(false);
        }
        return () => {
            ignore = true;
        }
    }, []);

    return (
        <div className="flex flex-col items-center p-4 gap-2 sm:p-0 sm:gap-0">
            <header style={`${color}` !== '' ? ["N", "W", "Q", "R"].indexOf(`${params.trainid}`) < 0 ? {backgroundColor: `#${color}`, color: 'white', fontWeight: 'bold' } : {backgroundColor: `#${color}`, color: 'black', fontWeight: 'bold' } : 
            { color: 'black', fontWeight: "bold", backgroundColor: "white", border: "#D3D3D3 solid"}} className="rounded-full px-4 py-2 text-4xl font-bold">{params.trainid}</header>
            <ul className="w-6/12 p-2 rounded-xl min-h-screen bg-slate-200 sm:w-full sm:rounded-none lg:w-fit">
            <InfiniteScroll
                dataLength={increase * (parseInt(counter) + 1)}
                next={getStations}
                hasMore={hasMore}
                loader={<h4 className="text-center">Loading...</h4>}
                scrollThreshold={'100%'}
                >
                {stations.map( (element, index) => {
                    return (
                        <div key={index}>
                            <Stop train={params.trainid} color={color} key={element.name} element={element}/>
                        </div>
                    )
                })}
        </InfiniteScroll>
              
            </ul>
        </div>
    )
}

export default Train