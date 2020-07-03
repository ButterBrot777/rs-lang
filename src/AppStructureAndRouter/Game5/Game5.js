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

class Game5 extends Component{
  constructor(){
    super()
    this.state={
      startGame: false,
      loading: false,
      statistic: false
    }

    this.handleLoading = this.handleLoading.bind(this)
    this.handleGame = this.handleGame.bind(this)
    this.requestWords = this.requestWords.bind(this)
  }


  componentDidMount(){
    this.requestWords()
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

  requestWords(){
    fetch(`https://afternoon-falls-25894.herokuapp.com/words?page=0&group=3`)
         .then(res=>res.json())
         .then(data=>{
           this.setState({
             words: data,
           })
          })
  }

  render(){
    if(this.state.startGame){
      return(
        <div className="savannah-container">
          <Game  words={this.state.words}/>
        </div>
      )   
    }else if(this.state.loading){
      return(
        <div className="savannah-container">
          <Loading timer={3}  handleGame={this.handleGame}/>
        </div>
      )
    }else if(this.state.statistic){
      return(
        <div className="savannah-container">
          <Statistic />
        </div>
      )
    }else {
      return(
        <div className="savannah-container">
          <HomePage handleLoading={this.handleLoading}/>
        </div>
      )
    }
  }
}
export default Game5