import React, {useEffect, useState} from "react";
import GameWord from "./GameWord";
import GameWordCompleted from "./GameWordCompleted";
import style from '../style.css'

class Game extends React.Component{
    page = 0;
    constructor() {
        super()
        this.state = {
            loading:false,
            completed:false,
            array:[]

        }
    }

    completed = (prop,index) => {
        this.setState({completed:true, indexOfClick:index });
        (prop === true) ? this.setState({right:true}) : this.setState({right:false});
    };

    componentDidMount() {
        fetch('https://afternoon-falls-25894.herokuapp.com/words?page=2&group=0')
            .then(res => res.json())
            .then(data => {
                console.log(data[0])
                let currentData = data[this.page];
                this.setState({
                    loading:true,
                    obj: currentData,
                    data:data,
                    array:this.generateArray(currentData.wordTranslate)
                });

                console.log(this.state)
            })
    }
    //Функция которая будет генерировать похожее слова
    generateArray = (word) => {
        let arr = [word];
        this.getSamewords(word).then(
            data => {
                console.log(data);
               data[0].meanings.slice(0,4).map((e) => arr.push(e.translation.text))
            }
        );

        return   this.shuffle(arr);


    };
    sound = () => {
        let sound = new Audio(`https://raw.githubusercontent.com/22-22/rslang/rslang-data/data/${this.state.obj.audio}`)
        sound.play()

    };
    getSamewords = (word) => {
        return fetch(`https://dictionary.skyeng.ru/api/public/v1/words/search?search=${word}`)
            .then(res => res.json())
    }

     shuffle = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array

    };
    nextPage = () => {
        this.page = ++this.page;
        this.setState({obj:this.state.data[this.page], completed:false,array:this.generateArray(this.state.data[this.page].wordTranslate)})
        console.log(this.state.data[this.page].word)



    };
    componentDidUpdate(){
        if(this.state.completed === false){
            this.sound()
            console.log(123)
        }
    }


    render() {
        if(this.state.loading === false){
            return <p>Загрузка</p>
        }else{

            return(
                <div>
                    {(this.state.completed) ? <Image sound = {this.sound} word = {this.state.obj.word} path = {this.state.obj.image}/>:<div  className="sound" onClick={() => this.sound()}>звук</div> }
                    <div className="word__container">
                        {this.state.array.map((e,i) =>
                            (this.state.completed === false) ?
                            <GameWord state = {this.state}
                                      index = {i}
                                      word = {e}
                                      rightWord = {this.state.obj.wordTranslate}
                                      completed = {this.completed}
                                      />
                                      :
                                <GameWordCompleted state = {this.state}
                                          index = {i}
                                          word = {e}
                                          rightWord = {this.state.obj.wordTranslate}
                                          completed = {this.completed}
                                          clicked = {this.state.indexOfClick}
                                          answer = {this.state.right}
                                />
                        )}
                    </div> 
                    {(this.state.completed === false) ? <button onClick={() => this.nextPage()}>Не знаю</button>:<button onClick={() => this.nextPage()}>готово</button>}
                </div>
            )
        }

    }
}
class Image extends React.Component{
    render() {
        return(
            <div>
                <img  className = "image" src={`https://raw.githubusercontent.com/22-22/rslang/rslang-data/data/${this.props.path}`}/>
                <div>
                    <p> {this.props.word}</p>
                    <div className="sound" onClick={() => this.props.sound()}>Звук</div>
                </div>
            </div>
            )
    }
}
export default Game