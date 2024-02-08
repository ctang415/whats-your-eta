import { createContext } from "react";

export const Context = createContext({
    setTrains: () => {},
    trains: null
});