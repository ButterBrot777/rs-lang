import React, {Component} from 'react';

import WordsAll  from '../../AllWords/AllWords' 
import Buttons from './Buttons'
import Statistic from '../../SmallStatistic/SmallStatistic'

import soundFalse from './sound/false.mp3'
import soundTrue from './sound/true.mp3'
class Game extends Component{
  timer = this.props.difficulty
  trueAnswer = []
  falseAnswer = []
  constructor(props){
    super(props)
    this.state={
      end:false,
      statistic: false,
      wordsToLearn: this.props.words,
      response: null,
      visibilityBtns: true,
      word: 0
    }

    this.shuffleWordsBtns = this.shuffleWordsBtns.bind(this)
    this.timerRaund = this.timerRaund.bind(this)
    this.nextWord = this.nextWord.bind(this)
    this.arrayRandElement = this.arrayRandElement.bind(this)
    this.responseMarker = this.responseMarker.bind(this)
    this.sound =this.sound.bind(this)
  }
  sound(flag){
      const sound = new Audio(flag ? soundTrue : soundFalse);
      sound.play();
  }
  componentDidMount(){
    this.timerRaund()
  }
  responseMarker(response){
     this.setState({
      response: response,
      visibilityBtns:false
     })
  }
  nextWord(word){
    this.timer = this.props.difficulty
    if(word === this.state.wordsToLearn[this.state.word].wordTranslate){
      this.responseMarker(true)
      this.sound(true)
      this.trueAnswer.push(this.state.wordsToLearn[this.state.word])
    }else{
      this.responseMarker(false)
      this.sound(false)
      this.falseAnswer.push(this.state.wordsToLearn[this.state.word])
    }
    let timer = setTimeout(()=>{
      if(this.state.word === this.state.wordsToLearn.length-1){
        this.setState({ 
          end:!this.state.end,
          response:null
        })
      }else{
        this.setState({
          word: this.state.word+1,
          visibilityBtns:true,
          response:null
        })
      }
    clearInterval(timer)
    }, 1000)
  }
  timerRaund(){
    let timer = setInterval(()=>{
      if(this.timer === 0 & this.state.word === this.state.wordsToLearn.length 
        || this.state.word === this.state.wordsToLearn.length-1 & this.state.end){
        this.setState({
          statistic: !this.state.statistic,
          word:0
        })
        clearInterval(timer)
      }else if(this.timer === 0 & this.state.word < this.state.wordsToLearn.length){
        this.nextWord()
      }else {
        this.timer = this.timer-1
      }   
    }, 1000)
  }
  arrayRandElement(arr) {
    let ArrayNameBtns =[]
    while (ArrayNameBtns.length !== 3){
      let random = Math.floor(Math.random() * arr.length);
      if(this.state.wordsToLearn[this.state.word].wordTranslate !== arr[random]){
        ArrayNameBtns.push(arr[random])
      }
    }
    ArrayNameBtns.push(this.state.wordsToLearn[this.state.word].wordTranslate)
    return ArrayNameBtns
  }
  shuffleWordsBtns(){
    let array = this.arrayRandElement(WordsAll)
    for (let i=array.length-1; i>0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array
  }

  render(){
    if(this.state.statistic){
      return <Statistic  true={this.trueAnswer} false={this.falseAnswer} nameGame={'savannah'} homePageGame={this.props.resetGame} newPage={Number(localStorage.getItem('page'))} newLevel={Number(localStorage.getItem('level'))} totalGame={false}/>
    }else{
      return(
        <div className='savannah-game'>
          <span>{this.state.word+1}/{this.state.wordsToLearn.length}</span>
          <div className='savannah-game_content'>
            {this.state.response === null ? '': 
            <div className='result-response' style={{color: this.state.response?'green':'red'}}> {this.state.response?'True':'False'} </div>}
            <div className='savannah-game_content-item' key ={this.state.wordsToLearn[this.state.word].word} style={{ animationDuration: (Number(this.props.difficulty)+1.7)+'s'}}>
              {this.state.wordsToLearn[this.state.word].word}
            </div>
          </div>
          <div className='savannah-game_control-btns'>
            {this.state.end ? '': this.state.visibilityBtns ? <Buttons words={this.shuffleWordsBtns()} nextWord={this.nextWord} /> : ''}
          </div>
        </div>
      )
    }
  }
}
export default Game