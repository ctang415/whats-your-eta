import { useEffect } from "react";
import { useState } from "react";
import BusAlert from "./busAlert";
import BusStops from "./busStops";

const Buses = () => {
    const [buses, setBuses] = useState([]);
    const [search, setSearch] = useState('');
    const [searched, setSearched] = useState(false);
    const [error, setError] = useState('');

    async function getBusData(e) {
        e.preventDefault();
        if (search.trim() !== '') {
        setSearched(false);
        setBuses([]);
        setError('');
        try {
            const response = await fetch (`http://localhost:3000/buses/${search}`);
            if (!response.ok) {
                throw await response.json();
            }
            const data = await response.json();
            setBuses(data);
            setSearched(true);
        } catch (err) {
            setError(err);
            console.log(err);
        }
    } else {
        setError('Please enter a valid input.');
    }
    }

    if (!searched) {
        return (
            <div className="flex flex-col self-center w-6/12 p-2 rounded-xl min-h-screen bg-slate-200 sm:w-full sm:rounded-none lg:w-3/4">
                <h3 className="text-4xl text-center font-bold">Buses</h3>
                <div className="flex flex-row justify-around py-4">
                    <form className="self-center flex flex-row gap-2" onSubmit={(e) => getBusData(e)}>
                        <input className="p-2 rounded-xl" placeholder="M10, Q30, B6..." onChange={(e) => setSearch(e.target.value.trim())} required/>
                        <button className="bg-slate-400 rounded-full p-2 text-white font-bold hover:scale-105" type='submit'>Search</button>
                    </form>
                </div>
                <p className="self-center">{error}</p>
            </div>
        )
    } else {
        return (
            <div className="flex flex-col self-center w-6/12 p-2 rounded-xl min-h-screen bg-slate-200 sm:w-full sm:rounded-none lg:w-3/4">
                <div className="flex flex-row justify-around py-4 sm:py-2">
                    <form className="self-center flex flex-row gap-2" onSubmit={(e) => getBusData(e)}>
                        <input className="p-2 rounded-xl" placeholder="Search by bus" onChange={(e) => setSearch(e.target.value)}/>
                        <button className="bg-slate-400 rounded-full p-2 text-white font-bold hover:scale-105" type='submit'>Search</button>
                    </form>
                </div>
                <ul className="flex flex-col gap-1 p-2 sm:text-sm">
                    <h3 className="font-bold text-3xl text-center sm:text-2xl">{buses.route}</h3>
                    {Object.entries(buses.alerts).map(([name, obj]) => ({name, ...obj})).map((alert, index) =>{
                        return (
                            <div key={index}>
                                <BusAlert alert={alert} alerts={buses.alerts}/>
                            </div>
                        )
                    })}
                    {buses.stops.map( (stop, index) => {
                        return (
                            <div key={index}>
                                <h4 className="font-bold text-l py-2 border-b-2 border-black">{stop.name.name}</h4>
                                <BusStops search={search} stop={stop} buses={buses}/>
                            </div>
                        )
                    })}
                </ul>
            </div>
        )
    }
}
export default Buses