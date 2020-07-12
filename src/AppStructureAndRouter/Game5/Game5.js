import React, {Component} from 'react';

import Loading from './Components/Loading'
import LoadingWindow from '../LoadingWindow/LoadingWindow'
import Game from './Components/Game'
import HomePage from './Components/HomePage'

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

  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const baseUrl = 'https://afternoon-falls-25894.herokuapp.com'

  const getAllUserWords = async () => {
    const rawResponse = await fetch(`${baseUrl}/users/${userId}/words/`, {
      method: 'GET',
      withCredentials: true,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      }
    });
    const content = await rawResponse.json();
    return content
     
  }
  const filterUserWords = async () => {
    const userWords = await getAllUserWords();
    const currentDate = new Date();
    const wordsForGame = userWords.filter(word => word.optional.deleted===false && word.optional.hardWord===false && word.optional.nextTrain <= +currentDate);
    return wordsForGame;
  }
  filterUserWords().then(wordsId=>{
    console.log(wordsId)
    return Promise.all(wordsId.map((wordId)=>getWordById(wordId.wordId))
  )
  }).then(res=>{
    console.log(res)
      this.setState({
        words: res,
      })
  })
  const getWordById = async (wordId) => {
    const url = `${baseUrl}/words/${wordId}?noAssets=true`;
    const rawResponse = await fetch(url);
    const content = await rawResponse.json();
    return content;
  }
  
  }
  render(){
    if(this.state.startGame){
      return(
          <div  id="video-bg">
            <video id="background-video" loop autoPlay>
              <source src={video} type='video/mp4' />
            </video>
            <Game  difficulty={this.state.difficultyGameSavannah} words={this.state.words} />
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
          {!this.state.words || this.state.loadingWindow ? <LoadingWindow background={'red'}/> : ''}
          <HomePage handleLoading={this.handleLoading} handleDifficulty ={this.handleDifficultyGameSavannah} difficulty={this.state.difficultyGameSavannah} handleLoadingWindow={this.handleLoadingWindow}/>
        </div>
      )
    }
  }
}
export default Game5

