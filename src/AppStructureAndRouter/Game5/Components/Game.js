import React, {Component} from 'react';

class Game extends Component{
  render(){
    return(
      <div>
      {console.log(this.props.words)}   
      Игра
      </div>
    )
  }
}
export default Game