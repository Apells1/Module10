  
// Repository:  medals-b-react
// Author:      Jeff Grissom
// Version:     3.xx
import React, { useState, useEffect, useRef } from 'react';
import Country from './components/Country';
import './App.css';
import axios from 'axios';
import {getCountries} from "./services/countryService";
import {getMedals} from "./services/medalService";
import NewCountry from './components/NewCountry';
const App = () => {
  const [ countries, setCountries ] = useState([]);
  const apiEndpoint = "https://github.com/Apells1/newmedals";
  const medals = useRef([
    //Hi jeff, i got this working in the react, but is it still possible to use a service to set the arrays?
    { id: 1, name: 'gold' },
    { id: 2, name: 'silver' },
    { id: 3, name: 'bronze' },
  ]);
  // useEffect(() => {
  //   let fetchedCountries = [
  //     { id: 1, name: 'United States', gold: 2, silver: 2, bronze: 3 },
  //     { id: 2, name: 'China', gold: 3, silver: 1, bronze: 0 },
  //     { id: 3, name: 'Germany', gold: 0, silver: 2, bronze: 2 },
  //   ]
  //   setCountries(fetchedCountries);
  // }, []);
  async function fetchData() {
    const { data: fetchedCountries } = await axios.get(apiEndpoint);
    setCountries(fetchedCountries);
  }
  fetchData();
  // const handleAdd = (name) => {
  //   const id = countries.length === 0 ? 1 : Math.max(...countries.map(country => country.id)) + 1;
  //   // let mutableCountries = [...countries];
  //   setCountries([...countries].concat({ id: id, name: name, gold: 0, silver: 0, bronze: 0 }));
  // }
  const handleAdd = async (name) => {
    const { data: post } = await axios.post(apiEndpoint, { name: name});
    setCountries(countries.concat(post));
  }
  // const handleDelete = (countryId) => {
  //   setCountries([...countries].filter(c => c.id !== countryId));
  // }
  const handleDelete = async (Id) => {
    await axios.delete(`${apiEndpoint}/${Id}`);
    setCountries(countries.filter(c => c.id !== Id));}
    
  const handleIncrement = (countryId, medalName) => {
    const idx = countries.findIndex(c => c.id === countryId);
    const mutableCountries = [...countries ];
    mutableCountries[idx][medalName] += 1;
    setCountries(mutableCountries);
  }
  const handleDecrement = (countryId, medalName) => {
    const idx = countries.findIndex(c => c.id === countryId);
    const mutableCountries = [...countries ];
    mutableCountries[idx][medalName] -= 1;
    setCountries(mutableCountries);
  }
  const getAllMedalsTotal = () => {
    let sum = 0;
    medals.current.forEach(medal => { sum += countries.reduce((a, b) => a + b[medal.name], 0); });
    return sum;
  }
  return (
    <React.Fragment>
      <div className='appHeading'>
        Olympic Medals
        <span className='badge'>
          { getAllMedalsTotal() }
        </span>
      </div>
      <div className='countries'>
          { countries.map(country => 
            <Country 
              key={ country.id } 
              country={ country } 
              medals={ medals.current }
              onDelete={ handleDelete }
              onIncrement={ handleIncrement } 
              onDecrement={ handleDecrement } />
          )}
      </div>
      <NewCountry onAdd={ handleAdd } />
    </React.Fragment>
  );
}
 
export default App;