import React, {Component} from 'react';
import {BrowserRouter as Router,Link} from "react-router-dom";

import './Game3.css'
class Game3 extends Component{
  constructor(){
    super()
  }
  render(){
    return(
      <div className="Game3">
      <h1>Game3</h1>
      <Link to="/HomePage"><button>Close Game3</button></Link>
      </div> 
    )
  }
}
export default Game3