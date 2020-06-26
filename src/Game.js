import React from 'react';
import getWords from './ServerRequests';
import Card from './Card';

import mainImg from './assets/main.jpg';
import starImg from './assets/star.png';
import mic from './assets/mic.png';

import './index.css';

const dataUrl = 'https://raw.githubusercontent.com/22-22/rslang/rslang-data/data/';
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'en-US';

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fullData: [],
            currentObj: '',
            inputValue: '',
            correctGuess: [],
            incorrectGuess: [],
            isRecognition: false,
            isStatistics: false,
            isGameStarted: false,
            page: 1,
            level: 1,
        }
    }

    startGame = async () => {
        const page = this.state.page - 1;
        const level = this.state.level - 1;
        const fullData = await getWords(page, level);
        this.setState({
            fullData,
        })
    }

    componentDidMount = () => {
        // this.getLevel (id)
        this.startGame();
    }

    changeLevel = () => {
        this.startGame();
    }

    filterIncorrectGuess = () => {
        let correctIds = this.state.correctGuess.map(el => el.id)
        let incorrectGuess = this.state.fullData.filter(el => !correctIds.includes(el.id))
        return incorrectGuess;
    }

    playSound = (audio) => {
        const url = `${dataUrl}${audio}`;
        const sound = new Audio(url);
        sound.play();
    }

    showResult = () => {
        let { wordTranslate, image } = this.state.currentObj;
        let src = `${dataUrl}${image}`;
        return (<div>
            <img className="image" src={src} alt=""></img>
            <div className="translation">{wordTranslate}</div>
        </div>);
    }

    updateImage = () => {
        let src = `${dataUrl}${this.state.currentObj.image}`;
        return (<div>
            <img className="image" src={src} alt=""></img>
        </div>)
    }

    checkGuess = () => {
        let correctWord = this.state.fullData.find(wordObj =>
            wordObj.word === this.state.inputValue);
        if (correctWord) {
            this.setState(prevState => ({
                correctGuess: [...prevState.correctGuess, correctWord],
                currentObj: correctWord
            }))
        }
    }

    handleRecognition = () => {
        recognition.onresult = (e) => {
            let recognized = e.results[0][0].transcript;
            this.setState({
                inputValue: recognized
            })
            this.checkGuess();
        }
    }

    startRecognition = () => {
        if (!this.state.isRecognition) {
            this.setState({
                isRecognition: true,
                currentObj: ''
            })
            recognition.start();
            this.handleRecognition();
        }
        recognition.onend = () => recognition.start();
    }

    handleCardClick = (e) => {
        if (!this.state.isRecognition) {
            let currId = e.target.closest('.card').dataset.id;
            let currentObj = this.state.fullData.find(el => el.id === currId);
            this.setState({
                currentObj
            })
            this.playSound(currentObj.audio);
        }
    }

    handleInputChange = (event) => {
        const target = event.target;
        const value = target.name === 'level' ? target.value : target.value;
        const name = target.name;
        if ((target.name === 'page' && target.value <= 30)
            || (target.name === 'level' && target.value <= 6)) {
            this.setState({
                [name]: value
            })
        } else {
            alert('max level = 6, max page = 30');
        }
    }

    openGame = () => {
        this.setState({
            isGameStarted: true
        })
    }

    openStats = () => {
        let incorrectGuess = this.filterIncorrectGuess()
        this.setState({
            isStatistics: true,
            incorrectGuess
        })
    }

    closeStats = () => {
        this.setState({
            isStatistics: false
        })
    }

    restartCurrentGame = () => {
        this.setState({
            currentObj: '',
            inputValue: '',
            correctGuess: [],
            incorrectGuess: [],
            isRecognition: false,
            isStatistics: false,
        })
    }

    render() {
        const resultBlock = (this.state.currentObj && !this.state.isRecognition)
            ? this.showResult()
            : (this.state.isRecognition && this.state.correctGuess.length > 0)
                ? this.updateImage()
                : (
                    <div>
                        <img className="image" src={mainImg} alt="main"></img>
                        <div className="translation"></div>
                    </div>
                )
        return (
            <div className="app">
                <div onClick={this.openGame} 
                className={this.state.isGameStarted ? "start-screen hidden" : "start-screen"}>
                    <h1 className="start-name">speakit</h1>
                    <p className="start-info">Click on the words to hear them sound.
                        Click on the button and speak the words into the microphone.</p>
                    <button className="start-button">start</button>
                </div>
                <div className={this.state.isStatistics ? "game hidden" : "game"}>
                    <div className="header">
                        <div>
                            <label>Level
                        <input type="text" name="level"
                                    value={this.state.level}
                                    onChange={this.handleInputChange}
                                    className="settings-inputs"></input>
                            </label>
                            <label>Page
                        <input type="text" name="page"
                                    value={this.state.page}
                                    onChange={this.handleInputChange}
                                    className="settings-inputs"></input>
                            </label>
                            <button className="btn btn-small" onClick={this.changeLevel}>Go!</button>
                        </div>
                        {this.state.correctGuess.length > 0 &&
                            (<div className="rating">
                                {this.state.correctGuess.map((el, idx) => <img className="star"
                                    key={idx} src={starImg} alt="star"></img>)}
                            </div>
                            )
                        }
                    </div>
                    <main className="main">
                        <div className="result-card">
                            <input value={this.state.inputValue}
                                className={this.state.isRecognition ? "input-speech"
                                    : "input-speech hidden"} type="text">
                            </input>
                            <img src={mic} className={this.state.isRecognition ? "mic" : "mic hidden"} alt="mic"></img>
                            {resultBlock}
                        </div>
                        <div className="cards">
                            {
                                this.state.fullData.map(wordObj =>
                                    <Card currentObj={this.state.currentObj} wordObj={wordObj}
                                        key={wordObj.id} isStatistics={this.state.isStatistics}
                                        onCardClick={this.handleCardClick} />)
                            }
                        </div>
                        <div className="btns">
                            <span onClick={this.restartCurrentGame} className="btn btn-restart">Restart</span>
                            <span onClick={this.startRecognition} className="btn btn-wide">Speak please</span>
                            <span className="btn btn-results" onClick={this.openStats}>Results</span>
                        </div>
                    </main>
                </div>
                <div className={this.state.isStatistics ? "results" : "results hidden"}>
                    <div className="results-container">
                        <p className="errors">Ошибок
                        <span className="errors-number">{this.state.incorrectGuess.length}</span>
                        </p>
                        <div className="error-items">
                            {
                                this.state.incorrectGuess.map(wordObj =>
                                    <Card wordObj={wordObj} currentObj={this.state.currentObj}
                                        key={wordObj.id} isStatistics={this.state.isStatistics}
                                        playSound={this.playSound} onCardClick={this.handleCardClick}
                                    />
                                )
                            }
                        </div>
                        <p className="success">Знаю
                        <span className="success-number">{this.state.correctGuess.length}</span>
                        </p>
                        <div className="success-items">
                            {
                                this.state.correctGuess.map(wordObj =>
                                    <Card wordObj={wordObj} currentObj={this.state.currentObj}
                                        key={wordObj.id} isStatistics={this.state.isStatistics}
                                        playSound={this.playSound} onCardClick={this.handleCardClick}
                                    />
                                )
                            }
                        </div>
                        <div className="results__btns">
                            <button className="btn btn-return" onClick={this.closeStats}>Return</button>
                            {/* <button className="btn res__btn-restart">New Game</button> */}
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}

export default Game;