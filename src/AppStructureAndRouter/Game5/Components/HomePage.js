import React, {Component} from 'react';

class HomePage extends Component{
  render(){
    return(
      <div>
        <button onClick={this.props.handleLoading}>Start</button>
      </div>
    )
  }
}
export default HomePage