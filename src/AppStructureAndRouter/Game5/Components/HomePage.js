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
          <p>Purpose of the game: have time to correctly answer the translation of the word. The choice is made
            mouse click or keystroke 1, 2, 3, 4
          </p>
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