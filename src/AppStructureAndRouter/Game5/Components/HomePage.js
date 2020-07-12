import React, {Component} from 'react';
import {BrowserRouter as Router,Link} from "react-router-dom";
class HomePage extends Component{
  componentDidMount(){
    this.props.handleLoadingWindow()
  }
  render(){
    return(
      <div>
        <div className = 'savannah-out-btn'>
          <Link to='/HomePage'><button>HomePage</button></Link> 
        </div>

        <div className='savannah-start-btn'>
          <button  onClick={this.props.handleLoading}>Start</button>
          <div className='game-difficulty' onChange = {(event)=>this.props.handleDifficulty(event.target.value)}>

            <input id="difficulty0" type="radio" value= "9" name="difficulty" defaultChecked />
            <label htmlFor="difficulty0">Easy</label>

            <input id="difficulty1" type="radio" value= "4" name="difficulty" />
            <label htmlFor="difficulty1">Middle</label>

            <input id="difficulty2" type="radio" value= "2" name="difficulty" />
            <label htmlFor="difficulty2">Hard</label>

          </div>
        </div>

      </div>
    )
  }
}
export default HomePage