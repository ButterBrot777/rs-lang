import React, {Component} from 'react';
// import {BrowserRouter as Router,Link} from "react-router-dom";


import './Game5.css'

// class Game5 extends Component{
//   constructor(props){
//     super(props)
//     this.state={
//        loading: true,
//        Game:false,
//        group:0,
//        page:0,
//        word:0,
//        statistic:{
//          trueWords:[],
//          falseWords:[]
//        }
//     }
//     this.requestWords = this.requestWords.bind(this)
//     this.startGame = this.startGame.bind(this)
//     this.nextWord = this.nextWord.bind(this)
//   }
//   componentDidMount(){
//     this.requestWords()
//   }
  
//   requestWords(){
//      fetch(`https://afternoon-falls-25894.herokuapp.com/words?page=${this.state.page}&group=${this.state.group}`)
//      .then(res=>res.json())
//      .then(data=>{
//        this.setState({
//          words: data,
//          loading:false
//        })
//        console.log(data)
//        console.log(this.state)
//       })
//   }
//  startGame(){
//    this.setState({
//      startGame: !this.state.startGame
//    })
//  }

//   nextWord(){
//     if(this.state.word < 19){
//       this.setState({
//         word:this.state.word+1
//       })
//     }else if(this.state.page < 29){
//       this.setState({
//         page: this.state.page+1,
//         loading: true,
//         word:0
//       })
//       this.requestWords()
//     }else if(this.state.group < 5){
//       this.setState({
//         group: this.state.group+1,
//         page: 0,
//         loading: true,
//         word:0
//       })
//       this.requestWords()
//     }
//   }

//   render(){
//     if(this.state.loading){
//       return <div className="Game5"><Loading /></div>
//     }else {
//       return(
//           <div className="Game5">
//             <div>{this.state.words[this.state.word].word}</div>
//             <button onClick={this.nextWord}>True</button>
//             <button onClick={this.nextWord}>False</button>
//           </div>
//         )
//     }
//   }
// }
// export default Game5

import Loading from './Components/Loading'
import Game from './Components/Game'
import Statistic from './Components/Statistic'
import HomePage from './Components/HomePage'

import video from  './images/background-video.mp4'
class Game5 extends Component{
  constructor(props){
    super(props)
    this.state={
      difficultyGameSavannah: '9',
      startGame: false,
      loading: false,
      statistic: false
    }

    this.handleLoading = this.handleLoading.bind(this)
    this.handleGame = this.handleGame.bind(this)
    this.requestWords = this.requestWords.bind(this)
    // this.requestWordsSynonyms = this.requestWordsSynonyms.bind(this)
    this.handleDifficultyGameSavannah = this.handleDifficultyGameSavannah.bind(this)

  }
  handleDifficultyGameSavannah(value){
    this.setState({
     difficultyGameSavannah:value
    })
 }

  componentDidMount(){
    this.requestWords()
    // .then(res=>this.requestWordsSynonyms(res)).then(data=> console.log(data))
  }

  handleLoading(){
    this.setState({
      loading: !this.state.loading
    })
  }
  handleGame(){
    this.setState({
      startGame: !this.state.startGame,
      loading: !this.state.loading
    })
  }
  // async requestWordsSynonyms(res){
  //   return Promise.all(
  //     res.map((word)=> this.qwe(word))
  //   )
  // }
  // qwe =(word)=>{
  //   return fetch(`https://dictionary.skyeng.ru/api/public/v1/words/search?search=${word.word}`)
  //   .then(res =>  res.json())
  //   .then(data => {
  //     // let DATA= [
  //     //   data[0].meanings[0].translation.text,
  //     //   data[1].meanings[0].translation.text,

  //     // ]
  //     return data
  //     // console.log(data)
  //   })
  // }
 async requestWords(){
  
  

  // const getAggregateUserWords = async () => {
    // %7B%22%24or%22%3A%5B%7B%22%24and%22%3A%5B%7B%22userWord.optional.deleted%22%3A%22false%22%2C%20%22userWord.optional.hardWord%22%3Afalse%7D%5D%7D%2C%7B%22userWord%22%3Anull%7D%5D%7D
    // const ourFilter = {"userWord.difficulty":"hard", "userWord.optional.key":"value"};


  //   const rawResponse = await fetch(`https://afternoon-falls-25894.herokuapp.com/users/${localStorage.getItem('userId')}/aggregatedWords?filter=%7B%22%24or%22%3A%5B%7B%22userWord.optional.deleted%22%3Afalse%2C%20%22userWord.optional.hardWord%22%3Afalse%7D%5D%7D`, {
  //     method: 'GET',
  //     withCredentials: true,
  //     headers: {
  //       'Authorization': `Bearer ${localStorage.getItem('token')}`,
  //       'Accept': 'application/json',
  //     }
  //   });
  //   const content = await rawResponse.json();
  //   const result = content[0].paginatedResults;
  //   this.setState({
  //     words: result,
  //   })
  //   console.log(result);
  // };
  // getAggregateUserWords()



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
     
  };
  
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
    // console.log(content)
    return content;
  }



    // fetch(`https://afternoon-falls-25894.herokuapp.com/words?page=0&group=3`)
    //      .then(res=>res.json())
    //      .then(data=>{
    //       //  return data
    //        this.setState({
    //          words: data,
    //        })
    //       })

  }

  render(){
    
    if(this.state.startGame){
      return(
        <div  id="video-bg">
          <video id="background-video" loop autoPlay>
              <source src={video} type='video/mp4' />
            </video>
          <Game  difficulty={this.state.difficultyGameSavannah} words={this.state.words}/>
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
    }else if(this.state.statistic){
      return(
        <div id="video-bg">
          <video id="background-video" loop autoPlay>
              <source src={video} type='video/mp4' />
          </video>
          <Statistic />
        </div>
      )
    }else {
      return(
        <div  id="video-bg">
            <video id="background-video" loop autoPlay>
              <source src={video} type='video/mp4' />
            </video>
            {/* <Statistic true={book1} false={book1}/> */}
          <HomePage handleLoading={this.handleLoading} handleDifficulty ={this.handleDifficultyGameSavannah} difficulty={this.state.difficultyGameSavannah}/>
        </div>
      )
    }
    
  }
}
export default Game5

