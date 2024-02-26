import './app.css';
import { Outlet } from 'react-router-dom';
import Header from './components/header';
import { Context } from './components/context';
import { useState } from 'react';
import { useEffect } from 'react';

function App() {
  const [trains, setTrains] = useState([]);
  const [list, setList] = useState([]);
  const [busList, setBusList] = useState([]);
  let ignore = false;

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
        setTrains(Object.values(groupBy(Object.values(data), 'color')));
    } catch (err) {
      console.log(err);
    }
  }

  function removeFromFavorites(name) {    
    if (localStorage.getItem("trains") !== undefined) {        
      let x = JSON.parse(localStorage.getItem("trains"));
      if (x.length > 1) {
        let filtered = x.filter(el => el.name !== name);
        localStorage.setItem("trains", JSON.stringify(filtered));
        setList(x);
      } else {
        localStorage.removeItem("trains");
        setList([]);
    }
  }
    //localStorage.removeItem(`${name}`);
}

function removeFromBusFavorites(name) {    
  if (localStorage.getItem("buses") !== undefined) {        
    let x = JSON.parse(localStorage.getItem("buses"));
    if (x.length == 1) {
      localStorage.removeItem("buses");
      setBusList([]);
    } else {
      let filtered = x.filter(el => el.stop !== name);
      localStorage.setItem("buses", JSON.stringify(filtered));
      setBusList(x);
  }
}
  //localStorage.removeItem(`${name}`);
}

  useEffect(() => {
    if (!ignore) {
      let x = JSON.parse(localStorage.getItem("trains"));
      let y = JSON.parse(localStorage.getItem("buses"));
      setList(x);
      setBusList(y);

      console.log(list);
      console.log(busList)
    }
    return () => {
      ignore = true;
    }
  }, [])

  return (
    <div className='min-h-screen flex flex-col bg-gray-100'>
      <Header />
      <Context.Provider value={{trains, setTrains, fetchTrains, removeFromFavorites, setList, list, setBusList, busList, removeFromBusFavorites}}>
      <Outlet />
      </Context.Provider>
    </div>
  )
}

export default App
 