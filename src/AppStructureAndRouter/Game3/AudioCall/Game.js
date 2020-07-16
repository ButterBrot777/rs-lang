import React from "react";
import GameWord from "./GameWord";
import GameWordCompleted from "./GameWordCompleted";
import Loading from "./Loading";
import Statistic from "./Statistic";
import { BrowserRouter as Router, Link } from 'react-router-dom';
import { getSettingsUser,getWordById,getAllUserWords,getNewWords} from '../../ServerRequest/ServerRequests';

import style from '../../../style.css'
import StartedPage from "./StartedPage";

const levenshtein = require('js-levenshtein');

class AudioCall extends React.Component{

    focusIndex = -1;
    constructor() {
        super()
        this.state = {
            loading:false,
            completed:false,
            array:[],
            ShortStatistic:{
                RightWords:[],
                FalseWords:[]
            },
            GameOver:false,
            right:false,
            startedPage:true,
            page:0

        }
    }

    userId = localStorage.getItem('userId');
    token = localStorage.getItem('token');
    baseUrl = 'https://afternoon-falls-25894.herokuapp.com';

    //Функцция которая переводит игру в режим выбрнного слова
    completed = (prop,index) => {

        this.setState({
            completed:true,
            indexOfClick:index,
            right:prop
        });


        document.removeEventListener('keydown',this.onKeyDown);

    };
    //Функция которая позволяет выбирать слова стрелочками
    onKeyDown = (event) => {
        if( this.state.focusIndex === undefined && event.keyCode === 39 ){
            this.focusIndex = 0
            this.setState({ focusIndex : this.focusIndex })

        }else if ( this.state.focusIndex === undefined && event.keyCode === 37 ){
            this.focusIndex = 4;
            this.setState({ focusIndex : this.focusIndex })

        } else {

            if( event.keyCode === 39 ) { ++this.focusIndex}
            if( event.keyCode === 37 ) { --this.focusIndex }
            if( this.focusIndex < 0 ) { this.focusIndex = 4 }
            if( this.focusIndex > 4 ) { this.focusIndex = 0 }
             this.setState({focusIndex:this.focusIndex})

        }


    };


    startGame = () => {
        this.setState({startedPage:false,})
    };






    getUserWord = async ( userId) => {
        const rawResponse = await fetch(`https://afternoon-falls-25894.herokuapp.com/users/${userId}/words/`, {
            method: 'GET',
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Accept': 'application/json',
            }
        });

        let content = await rawResponse.json();


        content = this.filterUserWords(content)



        let promises = content.map(async (e) => {
            let wordData =  await getWordById(e.wordId);
            return wordData
        });
        let statistic = await getSettingsUser();
        promises = promises.slice(0,100);

        let data = await Promise.all(promises);


        if (data.length < 20) {
            data = await this.addNewWords(data, statistic.page, statistic.level)
        }

        let currentData = data[0];



        this.setState({
            obj: currentData,
            data:data,
            loading:false,
            completed:false,

            ShortStatistic:{
                RightWords:[],
                FalseWords:[]
            },
            GameOver:false,
            right:false,
            statistic:false,
            page:0,


        });
        this.generateArray(currentData.wordTranslate);


    };



    componentDidMount() {

        document.addEventListener('keydown',this.onKeyDown);
        this.getUserWord(this.userId)
    }

    componentWillUpdate() {




    }

     filterUserWords = (userWords) => {
        const currentDate = new Date();
        let wordsForGame = [];
        userWords.filter(word => {
            if (!word.optional.deleted && !word.optional.hardWord && word.optional.nextTrain <= +currentDate) {
                wordsForGame.push(word);
            }
        });
        return wordsForGame;
    }

    addNewWords = async (userWords, pageTransition, levelTransition) => {
        if (userWords.length >= 20) {
            return userWords.slice(0, 20)
        } else {
            if (levelTransition < 29) {
                levelTransition += 1
            } else if (pageTransition < 5) {
                pageTransition += 1;
                levelTransition = 0;
            } else {
                pageTransition = 0;
                levelTransition = 0;
            }

            let addWords = await getNewWords(levelTransition, pageTransition)
            let newWordsFilter = addWords.filter(itemNewWords => !userWords.some(itemUserWords => itemUserWords.id === itemNewWords.id))
            userWords = userWords.concat(newWordsFilter)
            return this.addNewWords(userWords, pageTransition, levelTransition)
        }
    }


    //Функция которая будет генерировать похожее слова
    generateArray = (word) => {
      document.addEventListener('keydown',this.onKeyDown);
      let arr = [word];
      return  this.getSamewords(word).then(
            data => {
                this.setState({
                    array:this.shuffle(this.parseData(data,word).concat(arr)),
                    loading:true,
                    GameOver:false,

                });

                if(this.state.completed === false && this.state.startedPage === false){
                    this.sound()
                }
            }
        )
    };


    //функцияя которая получает данные из апи и находит похожеее
    parseData = (array,word) => {
        let result = []
        array.forEach((e,i) => {
            e.meanings.forEach((e) => result.push(e.translation.text))
        })
        let levenshteinResult = []
        result.forEach((e) => {

            levenshteinResult.push( {[e]:levenshtein(word,e)} )
        })
        levenshteinResult = levenshteinResult
            .sort((a,b) => Object.values(a)[0] - Object.values(b)[0])
            .filter((e) => Object.values(e)[0] !== 0 && Object.values(e)[0] !== 1 && Object.values(e)[0] !== 0)
            .slice(0,4).map((e) => Object.keys(e)[0]);
        return levenshteinResult;

    }
    //Функция проигрывающая звук
    sound = () => {
        let sound = new Audio(`https://raw.githubusercontent.com/22-22/rslang/rslang-data/data/${this.state.obj.audio}`)
        sound.play()

    };
    //функция которая получает объект синонимов
    getSamewords = (word) => {
        return fetch(`https://dictionary.skyeng.ru/api/public/v1/words/search?search=${word}`)
            .then(res =>  res.json())
    }
     //Функция которая перемешивает массив
     shuffle = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array

    };
    //Функция которая переходит к следующему слову
    nextPage = () => {
        if(this.state.right === true && this.state.completed === true){
            let StatisticArray = this.state.ShortStatistic.RightWords;
            StatisticArray.push(this.state.obj);

            this.setState({
                choseWithKeys:false,
                ShortStatistic:{
                    ...this.state.ShortStatistic,
                    RightWords:StatisticArray

                }
            })
        }else if(this.state.right === false && this.state.completed === true){
            let StatisticArray = this.state.ShortStatistic.FalseWords;
            StatisticArray.push(this.state.obj);
            this.setState({
                ShortStatistic:{
                    choseWithKeys:false,
                    ...this.state.ShortStatistic,
                    FalseWords:StatisticArray

                }
            })
        }
        if(this.state.page === 19){
            this.setState({GameOver:true})
        }else {
            let page = ++this.state.page;
            this.focusIndex = -1;
            this.setState({
                obj:this.state.data[page],
                completed:false,
                loading:false,
                array:this.generateArray(this.state.data[page].wordTranslate),
                right:false,
                focusIndex:undefined,
                page:page
            });
            if(this.state.right === false && this.state.completed === false){
                let StatisticArray = this.state.ShortStatistic.FalseWords;
                StatisticArray.push(this.state.obj);
                this.setState({
                    ShortStatistic:{
                        ...this.state.ShortStatistic,
                        FalseWords:StatisticArray

                    }
                })
            }
        }


    };
    startLoading = () => {
        this.setState({
            loading:true
        })
        this.getUserWord(this.userId)
    };

    render() {
        if(this.state.loading === false){
            return <Loading/>
        }else if(this.state.startedPage){
            return  <StartedPage startGame = {this.startGame}/>
        } else if(this.state.GameOver === true){
            return (
                <Statistic needToRemove = {this.onKeyDown}  statistic = {this.state.ShortStatistic} state = {this.state} newGame = {this.startLoading} />
            )
        }else{
            return(
                <div className='Main__container'  >
                    <div className={'close__button__container'}>
                        <Link to="/">
                            <button className={'button button_bordered close__button'}>close</button>
                        </Link>
                    </div>
                    <div className={'content__container'}>
                        <Image sound = {this.sound} word = {this.state.obj.word} path = {this.state.obj.image} state = {this.state}/>
                        <div className="word__container" >
                            {this.state.array.map((e,i) =>
                                (this.state.completed === false) ?
                                    <GameWord state = {this.state}
                                              key = {i}
                                              index = {i}
                                              word = {e}
                                              completed = {this.completed}
                                              choseWordWithEnter = {this.onKeyDown}

                                    />
                                    :
                                    <GameWordCompleted state = {this.state}
                                                       key = {i}
                                                       index = {i}
                                                       word = {e}
                                                       rightWord = {this.state.obj.wordTranslate}
                                                       completed = {this.completed}
                                                       clicked = {this.state.indexOfClick}
                                                       answer = {this.state.right}
                                                       id = {this.state.obj.id}
                                    />
                            )}
                        </div>
                        <button className={'button button_colored'} onClick={() => this.nextPage()}>{(this.state.completed === false) ? 'I dont know':'Done'}</button>
                    </div>
                </div>
            )
        }

    }
}
class Image extends React.Component{
    render() {
        return(
            <div >
                {(this.props.state.completed) ?
                    <div className='item__container'>
                        <img  className = "image"  src={`https://raw.githubusercontent.com/22-22/rslang/rslang-data/data/${this.props.path}`}/>
                        <div className='item__container'>
                            <div className="btn__container">
                                <div className="sound__small" onClick={() => this.props.sound()}/>
                                <p className={'hint__text'}> {this.props.word}</p>
                            </div>
                        </div>
                    </div> :
                    <div className='item__container'>
                        <div  className="sound"  onClick={() => this.props.sound()}/>
                    </div>
                }
            </div>
            )
    }
}
export default AudioCall