import React from "react";
import GameString from "./GameString";
import paintings1 from "./PathObjects/level1";


export default function GameBody(prop) {
    let wordIndex = 0;
    function complete() {
        playSound()
        prop.setState({
            ...prop.state,completed:true,
            canClicked:false,
            answerType:false,
        })
    }
    function showWord() {
        let endScreen = false;
        if(prop.state.stringCount === 9){
            endScreen = true;
            prop.setState({
                ...prop.state,
                endScreen:endScreen
            })
        } else {
            let str = prop.shuffle(prop.state.gameData[prop.state.stringCount + 1].textExample.split(' '));
            let strExample = str.slice(0)
            let chosenWords = new Array(str.length).fill('');
            let statisticWords = prop.state.answerType ? prop.state.statistic.trueWords : prop.state.statistic.falseWords;
            let length = str.map(e => e.length).reduce((acc,curr) => acc + curr,0);
            let lengthArray = str.map(e => e.length);
            let lastStrings = prop.state.lastStrings;
            let currentStr = prop.state.gameData[prop.state.stringCount + 1].textExample.split(' ');
            let lengthArrayCurrent = currentStr.map((e) => e.length)
            lastStrings.push({
                length:prop.state.length,
                lengthArrayCurrent:prop.state.lengthArrayCurrent,
                currentStr:prop.state.currentStr

            })


            statisticWords.push(prop.state.gameData[prop.state.stringCount]);
            prop.setState({
                ...prop.state,stringCount: ++prop.state.stringCount,
                currentStr:currentStr,
                lengthArrayCurrent:lengthArrayCurrent,
                endScreen:endScreen,
                completed:false,
                canClicked:true,
                needToCheck:false,
                currentString:str,
                checkedWords:[],
                chosenWords:chosenWords,
                indexOfPlayWord: 0,
                length:length,
                lengthArray:lengthArray,
                strExample:strExample,
                lastStrings:lastStrings,
                statistic:{
                    ...prop.state.statistic,
                    [prop.state.answerType ? 'trueWords':'falseWords']:statisticWords
                }
            })

        }


    }

    function check() {
       let result = prop.state.gameData[prop.state.stringCount].textExample.split(' ').map((e,i) => (e === prop.state.chosenWords[i]))
        if(result.indexOf(false) === -1){
            playSound()
            prop.setState({...prop.state,checkedWords:result,completed:true,answerType:true})
        }else{
            prop.setState({...prop.state,checkedWords:result})}

    }

    function playSound() {
        let path = prop.state.gameData[prop.state.stringCount].audioExample;
            let audio = new Audio(`https://raw.githubusercontent.com/22-22/rslang/rslang-data/data/${path}`);
            audio.pause();
            audio.play()
    }

    function button() {
         if( prop.state.completed === true ){
             return <button onClick={() => showWord()}>continue</button>
         } else if(prop.state.needToCheck && prop.state.completed === false) {
             return <button onClick={() => check()}> Check</button>
         }else if(prop.state.needToCheck === false && prop.state.completed === false ){
            return <button onClick={() => complete()}>I dont know</button>
         }
    }

    return (
        <div >
            <div className='main__container'>
                <div className={'game__hint'}>
                    {(prop.state.settings.soundButton) ? <button onClick={() => playSound()}> звук</button>:''}
                    {(prop.state.settings.translation) ? <p>{prop.state.gameData[prop.state.stringCount].textExampleTranslate}</p>:null}
                </div>
                {prop.state.gameData.slice(0,prop.state.stringCount + 1)
                    .map((e, i) =>
                        <GameString
                                    key = {i}
                                    gameState = {prop.state}
                                    string = {e.textExample}
                                    index ={i} canClicked = {false}
                                    play = {false}
                        />)}
            </div>
            <div className={'play__field'}>
                <GameString
                    string = {prop.state.gameData[prop.state.stringCount].textExample}
                    gameState = {prop.state}
                    canClicked = {prop.state.canClicked}
                    index = {prop.state.stringCount}
                    play = {true}
                />
            </div>
            {button()}
        </div>
    )
}