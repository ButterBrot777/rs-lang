import React, {Component} from 'react';
import StatisticsHeader from './statisticsHeader';
import GeneralStat from './generalStat';
import GamesStat from './gamesStat';

import './Statistics.css'
class Statistics extends Component{
  constructor(){
    super()
    this.state={
      landingPage:true,
      singIn:false,
      statType: 'general'     
    }

  }

  getGeneralStat = () => {
    this.setState({statType:'general'});
  }

  getGamesStat = () => {
    this.setState({statType:'games'});
  }
  render(){
    return(
      <div className="statistics">
        <header className="statistics-header">
          <StatisticsHeader stat={this.state.statType} getGeneralStat={this.getGeneralStat} getGamesStat={this.getGamesStat} />
        </header>
        <div className="statistics-data">
          {this.state.statType === "general" ? <GeneralStat /> : <GamesStat />}
        </div>
        
      </div> 

    )
  }
}
export default Statistics