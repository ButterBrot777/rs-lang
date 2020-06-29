import React from "react";
import GameWord from "./GameWord";
import GameWordCompleted from "./GameWordCompleted";
import Loading from "./Loading";
import Statistic from "./Statistic";

import style from '../style.css'

const levenshtein = require('js-levenshtein');

class Game extends React.Component{
    page = 0;
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

        }
    }
    //Функцция которая переводит игру в режим выбрнного слова
    completed = (prop,index) => {
        console.log(123123123);
        this.setState({
            completed:true,
            indexOfClick:index,
            right:prop
        });
        console.log('staaaaate',this.state)

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
            console.log(event.keyCode)
            if( event.keyCode === 39 ) { ++this.focusIndex}
            if( event.keyCode === 37 ) { --this.focusIndex }
            if( this.focusIndex < 0 ) { this.focusIndex = 4 }
            if( this.focusIndex > 4 ) { this.focusIndex = 0 }
             this.setState({focusIndex:this.focusIndex})

        }


    };

    componentDidMount() {
        document.addEventListener('keydown',this.onKeyDown);
        fetch('https://afternoon-falls-25894.herokuapp.com/words?page=2&group=0')
            .then(res => res.json())
            .then(data => {
                console.log(data[0])

                let currentData = data[this.page];
                this.generateArray(currentData.wordTranslate);
                this.setState({
                    obj: currentData,
                    data:data,

                });
            })
    }

    componentWillUpdate() {
        if(this.page === 19 && this.state.GameOver === false){
            this.setState({GameOver:true})
        }
        if(this.state.right === true && this.state.completed === true){
            let StatisticArray = this.state.ShortStatistic.RightWords;
            StatisticArray.push(this.state.obj);
            console.log(1)
            this.setState({
                choseWithKeys:false,
                ShortStatistic:{
                    ...this.state.ShortStatistic,
                    RightWords:StatisticArray

                }
            })
        }else if(this.state.right === false && this.state.completed === true){
            console.log(2)
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
        console.log(this.state)
    }


    //Функция которая будет генерировать похожее слова
    generateArray = (word) => {
      document.addEventListener('keydown',this.onKeyDown);
      let arr = [word];
      return  this.getSamewords(word).then(
            data => {
                console.log(data)
                this.setState({array:this.shuffle(this.parseData(data,word).concat(arr)),loading:true});
                if(this.state.completed === false){
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
            .filter((e) => Object.values(e)[0] !== 0 && Object.values(e)[0] !== 1)
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
        this.page = ++this.page;
        this.focusIndex = -1;
        this.setState({
            obj:this.state.data[this.page],
            completed:false,
            loading:false,
            array:this.generateArray(this.state.data[this.page].wordTranslate),
            right:false,
            focusIndex:undefined,
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
        console.log(this.state)
    };

    render() {
        if(this.state.loading === false){
            return <Loading/>
        }else if(this.state.GameOver === true){
            return (
                <Statistic needToRemove = {this.onKeyDown} statistic = {this.state.ShortStatistic}/>
            )
        }else{
            return(
                <div className='Main__container'  onKeyDown={(e)=>console.log(e.keyCode)}>
                    <div>Закрыть</div>
                    <Image sound = {this.sound} word = {this.state.obj.word} path = {this.state.obj.image} state = {this.state}/>
                    <div className="word__container" onKeyDownCapture={() => console.log(123)}>
                        {this.state.array.map((e,i) =>
                            (this.state.completed === false) ?
                            <GameWord state = {this.state}
                                      index = {i}
                                      word = {e}
                                      completed = {this.completed}
                                      choseWordWithEnter = {this.onKeyDown}

                                      />
                                      :
                                <GameWordCompleted state = {this.state}
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
                    <button onClick={() => this.nextPage()}>{(this.state.completed === false) ? 'Не знаю':'Готово'}</button>
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
                    <div>
                        <img  className = "image" src={`https://raw.githubusercontent.com/22-22/rslang/rslang-data/data/${this.props.path}`}/>
                        <div className='item__container'>
                            <div className="sound__small" onClick={() => this.props.sound()}/>
                            <p> {this.props.word}</p>
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
export default Game