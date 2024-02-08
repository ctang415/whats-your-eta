import './app.css';
import { Outlet } from 'react-router-dom';
import Header from './components/header';
import { Context } from './components/context';
import { useState } from 'react';

function App() {
  const [trains, setTrains] = useState([]);

  return (
    <div className='min-h-screen flex flex-col bg-gray-100'>
      <Header />
      <Context.Provider value={{trains, setTrains}}>
      <Outlet />
      </Context.Provider>
    </div>
  )
}

export default App
 