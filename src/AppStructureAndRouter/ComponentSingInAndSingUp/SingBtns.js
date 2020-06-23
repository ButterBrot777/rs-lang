import React, {Component} from 'react';

class SingBtns extends Component{
  constructor(props){
    super(props)
    
    this.state={
    }

  }
  render(){
  return(
    <div className="header__btn-block">
      <button onClick={this.props.handleSingIn}> Sing In</button>
      <button onClick={this.props.handleSingUp}> Sing Up</button>
    </div>
  )
  }
}

export default SingBtns
