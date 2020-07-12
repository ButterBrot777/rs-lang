import React, {Component} from 'react';

class Loading extends Component{
  constructor(props){
    super(props)
    this.state={
      timeLeft: this.props.timer
    }
    this.startTimer = this.startTimer.bind(this)
  }
  componentDidMount(){
    this.startTimer()
  }
  startTimer(){
    let timer = setInterval(()=>{
      this.setState({
        timeLeft: this.state.timeLeft-1
      })
      if(this.state.timeLeft === 0){
        clearInterval(timer)
        this.props.handleGame()
      }
    }, 1000)
  }
  render(){
    return(
      <div className="savannah-loading">
        {this.state.timeLeft}
      </div>
    )
  }
} 
export default Loading