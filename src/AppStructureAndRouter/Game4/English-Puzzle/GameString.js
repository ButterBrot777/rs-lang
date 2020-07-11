import React,{useState} from "react";
import GameWord from "./GameWord";
import PlayableString from "./playableString";
export default function GameString(prop) {

    function renderWords() {

          if ( prop.gameState.completed === false && prop.index === prop.gameState.stringCount && prop.play === false ) {
              return   prop.gameState.chosenWords.filter(e => e !== '').map((e, i) => <GameWord word = {e}  state = {prop.gameState} index = {i} needStyle = {true} strIndex = {prop.index}/>)
          }else if( prop.gameState.completed === true && prop.index === prop.gameState.stringCount){
              return  prop.string.split(' ').map((e, i) => <GameWord word = {e} state = {prop.gameState} needStyle = {true} index = {i} strIndex = {prop.index}/>)
          } else if ( prop.canClicked === true && prop.play === true ) {
              return  prop.gameState.currentString.map((e, i) => <PlayableString  word = {e} canClicked = {prop.canClicked} index = {i}/>)
          }
          else {
              return  prop.string.split(' ').map((e) => <GameWord word = {e} state = {prop.gameState} needStyle = {false} strIndex = {prop.index} />)
          }
    }
   return (

       <div className='game__string'>
           {renderWords()}
       </div>
   )
}