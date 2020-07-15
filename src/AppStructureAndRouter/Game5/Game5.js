import React, {Component} from 'react';

import Loading from './Components/Loading'
import LoadingWindow from '../LoadingWindow/LoadingWindow'
import Game from './Components/Game'
import HomePage from './Components/HomePage'
import {loginUser, signInRequest, signUpRequest, startSettingsUser, addSettingsUser, getSettingsUser, updateStatisticsUser, getStatisticsUser, getNewWords, getUserWord, getAllUserWords, createUserWord, updateUserWord, filterUserWords, getWordById} from '../ServerRequest/ServerRequests'



import './Game5.css'
import video from  './images/background-video.mp4'
class Game5 extends Component{
  constructor(props){
    super(props)
    this.state={
      difficultyGameSavannah: '9',
      startGame: false,
      loadingWindow: true,
      loading: false
    }
    this.handleLoading = this.handleLoading.bind(this)
    this.handleGame = this.handleGame.bind(this)
    this.requestWords = this.requestWords.bind(this)
    this.handleDifficultyGameSavannah = this.handleDifficultyGameSavannah.bind(this)
    this.handleLoadingWindow = this.handleLoadingWindow.bind(this)
    this.addNewWords =this.addNewWords.bind(this)
    this.resetGame = this.resetGame.bind(this)
  }
  
  resetGame(){
    this.requestWords()
    this.setState({
      difficultyGameSavannah: '9',
      startGame: false,
      loadingWindow: true,
      loading: false
    })
  }

  async addNewWords(userWords, pageTransition, levelTransition){
    if(userWords.length >= 20){
      return userWords.slice(0,20)
    }else{
      if(levelTransition<29){
        levelTransition+=1
      }else if(pageTransition < 5){
        pageTransition += 1
        levelTransition = 0 
      }else{
        pageTransition = 0
        levelTransition = 0 
      }
      localStorage.setItem('page',pageTransition)
      localStorage.setItem('level',levelTransition)

      let addWords = await getNewWords(levelTransition, pageTransition)
      let newWordsFilter = addWords.filter(itemNewWords => !userWords.some(itemUserWords => itemUserWords.id === itemNewWords.id))
      userWords = userWords.concat(newWordsFilter)
      return this.addNewWords(userWords, pageTransition, levelTransition)
    }
  }
  
  handleDifficultyGameSavannah(value){
    this.setState({
     difficultyGameSavannah:value
    })
  }

  componentDidMount(){
    this.requestWords()
  }

  handleLoading(){
    this.setState({
      loading: !this.state.loading
    })
  }
  handleLoadingWindow(){
    this.setState({
      loadingWindow: false
    })
  }
  handleGame(){
    this.setState({
      startGame: !this.state.startGame,
      loading: !this.state.loading
    })
  }

 async requestWords(){
  filterUserWords()
  .then(wordsId=>{
      return Promise.all(wordsId.map((wordId)=>getWordById(wordId.wordId)))})
  .then(userWords=>{
    getSettingsUser()
    .then(res=>{
      let pageTransition = res.optional.level
      let levelTransition = res.optional.page
      this.addNewWords(userWords, pageTransition, levelTransition).then(res=> {
        this.setState({
          words: res,
        })
      })
    })
  })
  }

  render(){
    if(this.state.startGame){
      return(
          <div  id="video-bg">
            <video id="background-video" loop autoPlay>
              <source src={video} type='video/mp4' />
            </video>
            <Game  difficulty={this.state.difficultyGameSavannah} words={this.state.words} resetGame={this.resetGame}/>
          </div>
      )   
    }else if(this.state.loading){
      return(
        <div  id="video-bg">
          <video id="background-video" loop autoPlay>
            <source src={video} type='video/mp4' />
          </video>
          <Loading timer={3}  handleGame={this.handleGame}/>
        </div>
      )
    }else{
      return(
        <div  id="video-bg">
          <video id="background-video" loop autoPlay>
            <source src={video} type='video/mp4' />
          </video>
          {!this.state.words || this.state.loadingWindow ? <LoadingWindow background={'#161c2a'}/> : ''}
          <HomePage handleLoading={this.handleLoading} handleDifficulty ={this.handleDifficultyGameSavannah} difficulty={this.state.difficultyGameSavannah} handleLoadingWindow={this.handleLoadingWindow}/>
        </div>
      )
    }
  }
}
export default Game5