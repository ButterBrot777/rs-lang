import React, {Component} from 'react';

class HomePage extends Component{
  render(){
    return(
      <div className='savannah-start-btn'>
        <button  onClick={this.props.handleLoading}>Start</button>
        {/* <br></br> */}
        <div className='game-difficulty' onChange = {(event)=>this.props.handleDifficulty(event.target.value)}>

<input id="difficulty0" type="radio" value= "9" name="difficulty" defaultChecked/>
<label htmlFor="difficulty0">Easy</label>
{/* <br></br> */}
<input id="difficulty1" type="radio" value= "4" name="difficulty" />
<label htmlFor="difficulty1">Middle</label>
{/* <br></br> */}
<input id="difficulty2" type="radio" value= "2" name="difficulty" />
<label htmlFor="difficulty2">Hard</label>
</div>

      </div>
    )
  }
}
export default HomePage