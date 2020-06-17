import React, {Component} from 'react';
import {BrowserRouter as Router,Link} from "react-router-dom";

import './Game1.css'
class Game1 extends Component{
  constructor(){
    super()
  }
  render(){
    return(
      <div className="Game1">
      <h1>Game1</h1>
      <Link to="/HomePage"><button>Close Game1</button></Link>
      </div> 
    )
  }
}
export default Game1