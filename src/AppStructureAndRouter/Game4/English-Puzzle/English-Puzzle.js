import React, {useEffect, useState} from "react";
import StartedPage from "./StartedPage";
import GameHeader from "./GameHeader";
import GameBody from "./GameBody";
import Loading from "./Loading";
import Statistic from "./statistic";
import Context from "./context";
import EndScreen from "./EndScreen";
import paintings1 from "./PathObjects/level1";
import {getNewWords,getSettingsUser} from '../../ServerRequest/ServerRequests';

export default function EnglishPuzzle() {
  if(localStorage.getItem('translation') === null){ localStorage.setItem('translation','true') };
  if(localStorage.getItem('picture') === null){ localStorage.setItem('picture','true') };
  if(localStorage.getItem('soundButton') === null){ localStorage.setItem('soundButton','true') };
  if(localStorage.getItem('autoSound') === null){ localStorage.setItem('autoSound','true') };

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  const baseUrl = 'https://afternoon-falls-25894.herokuapp.com'

  const [gameState, setGameState] = useState({
        settings:{
            translation:localStorage.getItem('translation') === 'true',
            picture:localStorage.getItem('picture') === 'true',
            soundButton:localStorage.getItem('soundButton') === 'true',
            autoSound:localStorage.getItem('autoSound') === 'true',
        },

        startedPage:true,
        loading:true,
        endScreen:false,
        statisticScreen:false,

        imageCount:localStorage.getItem('imageCount') === null ? 0:Number(localStorage.getItem('imageCount')),
        showString:true,
        stringCount:0,
        completed:false,
        canClicked:true,
        indexOfPlayWord:0,
        needToCheck:false,
        currentString:[],
        checkedWords:[],
        lastStrings:[],
        length:0,
        currentStr:[],
        lengthArrayCurrent:[],
        chosenWords:[],
        gameData:[],


        answerType:false,
        statistic:{
            falseWords:[],
            trueWords:[]
        },



  });


  useEffect(() => {
      // setGameState({...gameState,completed:false})
      console.log(gameState)
  });

  useEffect(() => {
      getUserWord(userId)
      console.log(gameState)

  },[]);


   function filterUserWords(userWords){
        const currentDate = new Date();
        let wordsForGame = [];
        userWords.filter(word => {
            if (!word.optional.deleted && !word.optional.hardWord && word.optional.nextTrain <= +currentDate) {
                wordsForGame.push(word);
            }
        });
        return wordsForGame;
    }

    async function addNewWords(userWords, pageTransition, levelTransition){
        if(userWords.length >= 20){
            return userWords.slice(0,20)
        }else{
            if(levelTransition<29){
                levelTransition+=1
            }else if(pageTransition < 5){
                pageTransition += 1;
                levelTransition = 0;
            }else{
                pageTransition = 0;
                levelTransition = 0;
            }
            console.log(levelTransition, pageTransition)
            let addWords = await getNewWords(levelTransition, pageTransition)
            let newWordsFilter = addWords.filter(itemNewWords => !userWords.some(itemUserWords => itemUserWords.id === itemNewWords.id))
            userWords = userWords.concat(newWordsFilter)
            return addNewWords(userWords, pageTransition, levelTransition)
        }
    }


  async function getUserWord ( userId){
        const rawResponse = await fetch(`https://afternoon-falls-25894.herokuapp.com/users/${userId}/words/`, {
            method: 'GET',
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            }
        });
        let content = await rawResponse.json();
        let statistic = await getSettingsUser()
        console.log(content)


        content = filterUserWords(content)
        let promises = content.map(async (e) => {
           let wordData =  await getUserWordById(userId,e.wordId);
           return wordData
        });



        let dataArray = await Promise.all(promises);
      if(dataArray.length < 20){
          dataArray = await addNewWords(dataArray,statistic.page,statistic.level)
      }
      console.log(dataArray)
        dataArray = dataArray.filter(e => e.textExample
            .split(' ')
            .filter((e,i,array) => array.indexOf(e) !== array.lastIndexOf(e)).length === 0
        );
        let imageCount = Number(localStorage.getItem('imageCount'));
        let image = paintings1[imageCount];
        let str = shuffle(dataArray[0].textExample.split(' '));
        let currentStr = dataArray[0].textExample.split(' ');
        let lengthCurrent = currentStr.map(e => e.length)
        let strExample = str.slice(0);
        let wordLength = strExample.length
        let length = str.map(e => e.length).reduce((acc,curr) => acc + curr,0);
        let lengthArray = str.map(e => e.length);

        let emptyArray = new Array(str.length).fill('');
        console.log('ggggg',dataArray);
        setGameState({
            ...gameState,
            image:image,
            lengthArrayCurrent:lengthCurrent,
            currentStr:currentStr,
            gameData: dataArray,
            loading:false,
            chosenWords:emptyArray,
            currentString:str,
            strExample:strExample,
            length:length,
            lengthArray:lengthArray,
            wordLength:wordLength,
            statisticScreen:false,
            stringCount:0,
            canClicked: true,
            imageCount:imageCount,
            endScreen: false,
            lastStrings:[],
            statistic:{
                falseWords:[],
                trueWords:[]
            },
            completed:false,


            }
        )
      return dataArray

   };

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array

    };

    async function getUserWordById (userId, wordId ){
        const rawResponse = await fetch(`https://afternoon-falls-25894.herokuapp.com/words/${wordId}?noAssets=true`, {
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


  if ( gameState.startedPage === true && gameState.loading === false ) {
        return ( <StartedPage setGameState = {setGameState} state = {gameState}/> )
  }else if(  gameState.loading === true){
     return ( <Loading />)
  }else if(gameState.endScreen === true){
       return  <EndScreen state ={gameState} setState = {setGameState} newGame = {getUserWord}/>
  }else if(gameState.statisticScreen === true){
      return <Statistic state = {gameState} setState = {setGameState}  newGame = {getUserWord}/>
  } else if ( gameState.startedPage === false && gameState.loading === false) {
        return (
            <Context.Provider value={{gameState,setGameState}} >
                <div>
                    <GameHeader state = {gameState} setState = {setGameState} />
                    <GameBody   state = {gameState} setState = {setGameState} shuffle = {shuffle}/>
                </div>
            </ Context.Provider >
        )
  }

}