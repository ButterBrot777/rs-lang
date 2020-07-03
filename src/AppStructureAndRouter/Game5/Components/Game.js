import React, {Component} from 'react';

import Buttons from './Buttons'
import Statistic from './Statistic'
class Game extends Component{
  timer = 1
  trueAnswer = []
  falseAnswer = []
  constructor(props){
    super(props)
    this.state={
      end:false,
      statistic: false,
      wordsToLearn: this.props.words,
      word: 0
    }
    this.shuffleWordsBtns = this.shuffleWordsBtns.bind(this)
    this.timerRaund = this.timerRaund.bind(this)
    this.nextWord = this.nextWord.bind(this)

  }
  componentDidMount(){
    this.timerRaund()
  }
  nextWord(word){
    this.timer = 1
    console.log(word === this.state.wordsToLearn[this.state.word].wordTranslate, this.trueAnswer,  this.falseAnswer)
    
    if(word === this.state.wordsToLearn[this.state.word].wordTranslate){
      this.trueAnswer.push(this.state.wordsToLearn[this.state.word])
    }else{
      this.falseAnswer.push(this.state.wordsToLearn[this.state.word])
    }
    this.state.word === this.state.wordsToLearn.length-1 ? this.setState({ end:!this.state.end}) : this.setState({ word: this.state.word+1})
  }
 
  timerRaund(){
    let timer = setInterval(()=>{
      console.log(this.timer)
      if(this.timer === 0 & this.state.word === this.state.wordsToLearn.length || this.state.word === this.state.wordsToLearn.length-1 & this.state.end){
        this.setState({
          statistic: !this.state.statistic
        })
        clearInterval(timer)
      }else if(this.timer === 0 & this.state.word < this.state.wordsToLearn.length){
        this.nextWord()
      }else {
        this.timer = this.timer-1
      }   
    }, 1000)
  }
  
  shuffleWordsBtns(){
    let array = ['123', 'dasd', 'asdas', 'asdasd', this.state.wordsToLearn[this.state.word].wordTranslate]
      for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array
  }

  render(){
    if(this.state.statistic){
      return <Statistic  true={this.trueAnswer} false={this.falseAnswer}/>
    }else{
      return(
        <div className='savannah-game'>
          <div className='savannah-game_content'>
            <div className='savannah-game_content-item' key ={this.state.wordsToLearn[this.state.word].word}>
               {this.state.wordsToLearn[this.state.word].word}
            </div>
          </div>
          <div className='savannah-game_control-btns'>
            {this.state.end ? '' :<Buttons words={this.shuffleWordsBtns()} nextWord={this.nextWord} />}
          </div>
        {console.log(this.state)}   
        </div>
      )
    }
  }
}
export default Game