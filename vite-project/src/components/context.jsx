import { createContext } from "react";

export const Context = createContext({
    fetchTrain: () => {},
    setTrains: () => {},
    trains: null,
    setColors: () => {},
    colors: null,
    removeFromFavorites: () => {}
});