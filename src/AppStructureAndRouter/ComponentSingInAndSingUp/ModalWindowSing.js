import React, {Component} from 'react';
import {BrowserRouter as Router,Switch,Route,Link} from "react-router-dom";

import SingIn from './SingIn'
import SingUp from './SingUp'

class ModalWindowSing extends Component{
  constructor(props){
    super(props)
    this.state={
      singIn:this.props.flagSingIn,
      singUp:this.props.flagSingUp
    }
    this.handleSing = this.handleSing.bind(this)
  }
  handleSing(){
    this.setState({
      singIn: ! this.state.singIn
    })
  }
  render(){
    const CloseBtn = <button type='button' onClick={this.props.handleBtns}>Close</button>
  return(
    <Route path="/about">
    <div className="modal">
      <div className="modal__container">
      {this.state.singIn ? <SingIn CloseBtn={CloseBtn}/> : ''}
      <button onClick={this.handleSing}>{this.state.singIn ? 'Go to SingUp' : 'Go to Sing In'}</button>
      {!this.state.singIn ? <SingUp CloseBtn={CloseBtn}/> : ''}
      </div>
    </div>
    </Route>
  )
  }
}

export default ModalWindowSing