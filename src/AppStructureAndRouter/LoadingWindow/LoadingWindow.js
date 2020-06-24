import React, {Component} from 'react';
// import {BrowserRouter as Router,Link} from "react-router-dom";

import './LoadingWindow.css'
class LoadingWindow extends Component{
  constructor(){
    super()
  }
  render(){
    return(
      <div className='form-loading'>
       <h2>Loading...</h2>
      </div>
    )
  }
}
export default LoadingWindow