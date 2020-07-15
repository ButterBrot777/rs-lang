import React, {Component} from 'react';

class Buttons extends Component{
  constructor(props){
    super(props)
    this.state={
    }
    this.eventClick = this.eventClick.bind(this)
  }
  eventClick(event){
      let buttons =  document.body.querySelectorAll('.btns-wrapper button')
      buttons.forEach((el)=>{
        if(el.id === event.code){
          var evt = document.createEvent("HTMLEvents");
          evt.initEvent("click", true, false);
          el.dispatchEvent(evt)
        }
      })
  }
  componentDidMount(){
    document.addEventListener('keyup', this.eventClick)
  }
  componentWillUnmount(){
    document.removeEventListener('keyup', this.eventClick)
  }
  render(){
    return(
      <div className = 'btns-wrapper'>
        <button id="Digit1" onClick={(word) => this.props.nextWord(this.props.words[0])}><span>(1)</span>{this.props.words[0]}</button>
        <button id="Digit2" onClick={(word) => this.props.nextWord(this.props.words[1])}><span>(2)</span>{this.props.words[1]}</button>
        <button id="Digit3" onClick={(word) => this.props.nextWord(this.props.words[2])}><span>(3)</span>{this.props.words[2]}</button>
        <button id="Digit4" onClick={(word) => this.props.nextWord(this.props.words[3])}><span>(4)</span>{this.props.words[3]}</button>
      </div>
    )
  }
}
export default Buttons