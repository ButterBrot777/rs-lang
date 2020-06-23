import React, {Component} from 'react';

import SingBtns from './SingBtns'
import ModalWindowSing from './ModalWindowSing'

import './ComponentSingInAndSingUp.css'
class AppBtn extends Component{
  constructor(){
    super()
    this.state={
      singInRender: false,
      singUpRender: false
    }
    this.handleBtns = this.handleBtns.bind(this)
    this.handleSingIn = this.handleSingIn.bind(this)
    this.handleSingUp = this.handleSingUp.bind(this)
  }

  handleSingIn(){
    this.setState({
      singInRender: !this.state.singInRender
    })
  }
  handleSingUp(){
    this.setState({
      singUpRender: !this.state.singUpRender
    })
  }
  handleBtns(){
    this.setState({
      singInRender: false,
      singUpRender: false
    })
  }
  render(){
    return (
      <div>
      <SingBtns handleSingIn = {this.handleSingIn} handleSingUp ={this.handleSingUp}/>
      {this.state.singInRender || this.state.singUpRender ? 
    <ModalWindowSing flagSingIn={this.state.singInRender} flagSingUp={this.state.singUpRender} handleBtns={this.handleBtns}/> : ''}
      </div>
    )
  }
}
export default AppBtn
