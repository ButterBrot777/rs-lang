import React, {Component} from 'react';
import EnglishPuzzle from "./English-Puzzle/English-Puzzle";
import {BrowserRouter as Router,Link} from "react-router-dom";

import './Game4.css'
class Game4 extends Component{
  constructor(){
    super()
  }
  render(){
    return(
     <EnglishPuzzle />
    )
  }
}
export default Game4