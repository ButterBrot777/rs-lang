import React, {Component} from 'react';
import {BrowserRouter as Router,Link} from "react-router-dom";

import './Game4.css'
class Game4 extends Component{
  constructor(){
    super()
  }
  render(){
    return(
      <div className="Game4">
      <h1>Game4</h1>
      <Link to="/HomePage"><button>Close Game4</button></Link>
      </div> 
    )
  }
}
export default Game4