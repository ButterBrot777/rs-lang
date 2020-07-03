import React, {Component} from 'react';
import {BrowserRouter as Router,Link} from "react-router-dom";

import './Game3.css'
class Game3 extends Component{
  constructor(){
    super()
  }
  render(){
    return(
      <div className="Game3">
      <h1>Game3</h1>
      <Link to="/HomePage"><button>Close Game3</button></Link>
      </div> 
    )
  }
}
export default Game3


// import React, {Component} from 'react';

// import Buttons from './Buttons'
// class Game extends Component{
  
//   constructor(props){
//     super(props)
//     this.state={
//       wordsToLearn: this.props.words,
//       word: 0,
//       trueAnswer:[],
//       falseAnswer: []
//     }
//     // this.shuffleWordsBtns = this.shuffleWordsBtns.bind(this)
//   }
//   componentWillMount(){
//     let nextWord = setInterval(()=>{
//       if(this.state.word < this.state.wordsToLearn.length-1){
        
//         let array = ['123', 'dasd', 'asdas', 'asdasd', this.state.wordsToLearn[this.state.word].wordTranslate]
//         for (let i = array.length - 1; i > 0; i--) {
//           let j = Math.floor(Math.random() * (i + 1));
//           [array[i], array[j]] = [array[j], array[i]];
//         }
//         this.setState({
//           nameBtns: array,
//           word: this.state.word+1
//         })
//       } else{
//         clearInterval(nextWord)
//       }
//     }, 5000)
//   }

//   render(){
//     return(
//       <div className='savannah-game'>
//         <div className='savannah-game_content'>
//           <div className='savannah-game_content-item'>
//              {this.state.wordsToLearn[this.state.word].word}
//           </div>
//         </div>
//         <div className='savannah-game_control-btns'>
//           <Buttons words={this.state.nameBtns}/>
//         </div>
//       {console.log(this.state)}   
//       </div>
//     )
//   }
// }
// export default Game