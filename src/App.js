import React, { useState, useEffect } from 'react';
import axios from 'axios';

//import DataShips from './components/DataShips';
//import OnLoadingDataShips from './components/LoadingDataShips';




function App() {
  const [ships, setShips] = useState([]);
  
  
  useEffect(() => {
    const apiUrl = 'http://localhost:3000/api/getAllShips';
    axios.get(apiUrl).then((resp) => {
      const allShips = resp.data;
      let DisShips = [];
      for(let i = 0; i<allShips.length; i++){
        const {name} = allShips[i];
        const {model} = allShips[i];
        DisShips.push(name, model)
      }
      setShips(allShips);
    });
  }, []);

console.log(ships);
  return (
    <div className="app">
        {ships.map((ship)=>(
          <label>
          <div className="item-container" key={ship.name}>
            <h1>name:{ship.name}</h1>
            <h2 className="model">model:{ship.model}</h2>
            <h3 className="manufacturer">manufacturer:{ship.manufacturer}</h3>
            </div>
            </label>
        ))}
    </div>
  );
}


/*
function App() {
  const DataLoading =  OnLoadingDataShips(DataShips);

  const [ships, setShips] = useState(
    {
      loading: true,
      ships: !null,
    }
  )



  useEffect(() => {
    const apiUrl = 'http://localhost:3000/api/getAllShips';
    axios.get(apiUrl).then((resp) => {
      const allShips = resp.data;
      setShips(allShips);
    });
  }, [setShips]);


  return (
    <div className="app">
        <DataLoading isLoading={ships.loading} ships={ships.ships} />
    </div>
  );
}
*/


export default App;
