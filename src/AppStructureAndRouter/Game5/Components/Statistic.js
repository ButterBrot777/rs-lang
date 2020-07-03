import React, {Component} from 'react';

class Statistic extends Component{
  constructor(){
    super()
    this.state={

    }
  }
  // componentWillMount(){
  //   //  Перезаписываем статистику по изученным словам 
  // }
  
  render(){
    return(
      <div>
        <h2>Statistic</h2>
        <div className='statistic-content'>
        <div  className='statistic-content-true'>
          <h3>True</h3>
          {this.props.true.map((e) => <StatisticString word = {e} />) }
        </div>
        <div  className='statistic-content-false'>
          <h3>False</h3>
          {this.props.false.map((e) => <StatisticString word = {e} />) }
        </div>
        </div>
        
         {console.log(this.props.true, this.props.false)}
        <div>
          <button>Try Again</button>
          <button>Home Page</button>
        </div>
      </div>
    )
  }
}

class StatisticString extends Component {
  playSound = () => {
      let sound = new Audio(`https://raw.githubusercontent.com/22-22/rslang/rslang-data/data/${this.props.word.audio}`);
      sound.play()
  };
  render() {
      return (
          <div className='Statistic__word' onClick={() => this.playSound()}>
              <div>Sound</div>
              <div>{this.props.word.word}</div>
              <div>{this.props.word.wordTranslate}</div>
          </div>
      )
  }
}
export default Statistic