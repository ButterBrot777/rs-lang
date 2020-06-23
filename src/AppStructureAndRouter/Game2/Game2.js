import React, {Component} from 'react';
import {BrowserRouter as Router,Link} from "react-router-dom";

import './Game2.css'
class Game2 extends Component{
  constructor(){
    super()
  }
  render(){
    return(
      <div className="Game2">
      <h1>Game2</h1>
      <Link to="/HomePage"><button>Close Game2</button></Link>
      </div> 
    )
  }
}
export default Game2