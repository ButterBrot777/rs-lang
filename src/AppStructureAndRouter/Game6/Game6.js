import React, {Component} from 'react';
import {BrowserRouter as Router,Link} from "react-router-dom";

import './Game6.css'
class Game6 extends Component{
  constructor(){
    super()
  }
  render(){
    return(
      <div className="Game6">
      <h1>Game6</h1>
      <Link to="/HomePage"><button>Close Game6</button></Link>
      </div> 
    )
  }
}
export default Game6