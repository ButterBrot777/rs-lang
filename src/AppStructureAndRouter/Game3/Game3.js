import React, {Component} from 'react';
import {BrowserRouter as Router,Link} from "react-router-dom";
import AudioCall from "./AudioCall/Game";

import './Game3.css'
class Game3 extends Component{
  constructor(){
    super()
  }
  render(){
    return(
     <AudioCall />
    )
  }
}
export default Game3