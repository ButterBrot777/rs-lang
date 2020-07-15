import React, {Component} from 'react';
// import {BrowserRouter as Router,Link} from "react-router-dom";

import './LoadingWindow.css'
class LoadingWindow extends Component{
  constructor(props){
    super(props)
    this.state={

    }
  }
  render(){
    return(
      <div className="loader" style={{backgroundColor: `${this.props.background}`}}>
        <div className="l_main">
          <div className="l_square"><span></span><span></span><span></span></div>
          <div className="l_square"><span></span><span></span><span></span></div>
          <div className="l_square"><span></span><span></span><span></span></div>
          <div className="l_square"><span></span><span></span><span></span></div>
        </div>
      </div>
    )
  }
}
export default LoadingWindow