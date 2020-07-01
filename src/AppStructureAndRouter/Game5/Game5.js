import React, {Component} from 'react';
import {BrowserRouter as Router,Link} from "react-router-dom";

import './Game5.css'
class Game5 extends Component{
  constructor(){
    super()
  }
  render(){
    return(
      <div className="Game5">
      <h1>Game5</h1>
      <Link to="/HomePage"><button>Close Game5</button></Link>
      </div> 
    )
  }
}
export default Game5