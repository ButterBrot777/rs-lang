import React, {Component} from 'react';

import './Statistics.css'
class Statistics extends Component{
  constructor(){
    super()
    this.state={
      landingPage:true,
      singIn:false,
     
    }

  }
  render(){
    return(
      <div className="statistics">
      <h1>Statistics</h1>
      </div> 
    )
  }
}
export default Statistics