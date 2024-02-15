import './app.css';
import { Outlet } from 'react-router-dom';
import Header from './components/header';
import { Context } from './components/context';
import { useState } from 'react';
import { useEffect } from 'react';

function App() {
  const [trains, setTrains] = useState([]);
  const [list, setList] = useState('');
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
    localStorage.removeItem(`${name}`);
    setList(Object.keys(localStorage));
}

  useEffect(() => {
    if (!ignore) {
      setList(Object.keys(localStorage));
    }
    return () => {
      ignore = true;
    }
  }, [])

  return (
    <div className='min-h-screen flex flex-col bg-gray-100'>
      <Header />
      <Context.Provider value={{trains, setTrains, fetchTrains, removeFromFavorites, setList, list}}>
      <Outlet />
      </Context.Provider>
    </div>
  )
}

export default App
 