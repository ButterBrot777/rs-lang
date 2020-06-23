import React, {Component} from 'react';
import {BrowserRouter as Router,Link} from "react-router-dom";
import './HomePage.css'

class HomePage extends Component{
   render(){
     return (
       <div className = 'home-page'>
         <h2>HomePage</h2>
         <Link to="/Stat">Statist</Link>
         <div className='HomeGame'>Игра Юли</div>
       <div>
       <ul>
          <li>
            <Link to="/Game1">Game1</Link>
          </li>
          <li>
            <Link to="/Game2">Game2</Link>
          </li>
          <li>
            <Link to="/Game3">Game3</Link>
          </li>
          <li>
            <Link to="/Game4">Game4</Link>
          </li>
          <li>
            <Link to="/Game5">Game5</Link>
          </li>
          <li>
            <Link to="/Game6">Game6</Link>
          </li>
        </ul>
       </div>  
       </div>
     )
   }
}
export default HomePage