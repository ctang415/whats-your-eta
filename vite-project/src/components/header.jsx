<<<<<<< HEAD
const Header = () => {

=======
import Subway from "../assets/train.svg";
import Bus from "../assets/bus.svg";
import Favorite from "../assets/favorite.svg";
import Image from "./image";
import { Link } from "react-router-dom";

const Header = () => {
    
    return (
        <header className="flex flex-row justify-center gap-32 bg-gray-300 p-6">
            <Link to="/" className="flex flex-col items-center">
                <Image size={10} file={Favorite} img="Favorite"/>
                <p className="font-bold">Favorites</p>
            </Link>
            <Link to="/trains" className="flex flex-col items-center">
                <Image size={10} file={Subway} img="Subway"/>
                <p className="font-bold">Subway</p>
            </Link>
            <Link to="/buses" className="flex flex-col items-center">
                <Image size={10} file={Bus} img="Bus"/>
                <p className="font-bold">Bus</p>
            </Link>
        </header>
    )
>>>>>>> bc35576 (Added header and icons)
}

export default Header