import React, { Component } from 'react';
import { getSettingsUser, addSettingsUser, getNewWordsWithExtraParams } from '../ServerRequest/ServerRequests';
import LettersInput from './LettersInput';
import './BasicGame.css'

class Test extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fullData: [],
            currentData: {},
            currentDataIdx: 0,
            currentWord: '',
            inputValue: '',
            inputAttempt: '',
            correctGuesses: 0,
            incorrectGuesses: 0,
            wordsPerGame: 0,
            isGuessCheck: false,
            correctGuessesPercent: 0,
            coloredLetters: false,
            isImageLoaded: false,
        }
    }

    componentDidMount = async () => {
        let dataOne = await getNewWordsWithExtraParams(11, 1, 8);
        let dataTwo = await getNewWordsWithExtraParams(11, 1, 8);
        let dataThree = await getNewWordsWithExtraParams(11, 1, 3);
        let dataFour = await getNewWordsWithExtraParams(11, 1, 8);
        let dataFive = await getNewWordsWithExtraParams(11, 1, 8);
        let dataSix = await getNewWordsWithExtraParams(11, 1, 8);
        let fullData = [...dataThree, ...dataOne, ...dataFive, ...dataFour, ...dataSix, ...dataTwo];
        let currentData = this.findCurrentData(fullData, this.state.currentDataIdx);
        this.setState({
            fullData,
            currentData,
            currentWord: currentData.word,
        })
    }

    handleSettingsUpdate = async () => {
        let { wordsPerDay, optional } = await getSettingsUser(user);
        let hints = optional.hints;
        let correctGuessesPercent = this.state.correctGuessesPercent;
        let newLevel = (correctGuessesPercent < 33) ? 0
            : (correctGuessesPercent > 33 && correctGuessesPercent < 67) ? 1 : 2;
        let newSettings = {
                "wordsPerDay": wordsPerDay,
                "optional": {
                    "maxWordsPerDay": optional.maxWordsPerDay,
                    "level": newLevel,
                    "page": optional.page,
                    "wordsLearntPerPage": optional.wordsLearntPerPage,
                    "lastTrain": optional.lastTrain,
                    "hints": {
                        "meaningHint": hints.meaningHint,
                        "translationHint": hints.translationHint,
                        "exampleHint": hints.exampleHint,
                        "soundHint": hints.soundHint,
                        "imageHint": hints.imageHint,
                        "transcriptionHint": hints.transcriptionHint
                    },
            }
        };
        addSettingsUser(newSettings);
    }

    countCorrectGuessesPercent = () => {
        let correctGuessesPercent = Math.round(this.state.correctGuesses / this.state.fullData.length * 100);
        this.setState({
            correctGuessesPercent
        })
    }

    continueGame = () => {
        if (this.state.wordsPerGame !== this.state.fullData.length) {
            setTimeout(() => {
                this.goToNextCard()
            }, 2000)
        } else {
            this.countCorrectGuessesPercent();
            this.handleSettingsUpdate();
        }
    }

    checkIfCorrectGuess = () => {
        this.setState({
            inputAttempt: this.state.inputValue,
            inputValue: '',
        })
        if (this.state.currentWord === this.state.inputValue) {
            this.setState({
                correctGuesses: this.state.correctGuesses + 1,
                wordsPerGame: this.state.wordsPerGame + 1
            }, this.continueGame)
        } else {
            this.setState({
                incorrectGuesses: this.state.incorrectGuesses + 1,
                wordsPerGame: this.state.wordsPerGame + 1
            }, this.continueGame)
        }
    }

    goToNextCard = () => {
        this.setState({
            isGuessCheck: false,
            isImageLoaded: false
        })
        let currentDataIdx = this.state.currentDataIdx + 1;
        let currentData = this.findCurrentData(this.state.fullData, currentDataIdx);
        this.setState({
            currentWord: currentData.word,
            currentDataIdx,
            currentData,
        })
    }

    onClickFurther = () => {
        if (this.state.inputValue !== '') {
            this.setState({
                isGuessCheck: true,
                coloredLetters: true,
            })
            this.checkIfCorrectGuess();
            setTimeout(() => {
                this.setState({
                    coloredLetters: false
                })
            }, 2000)
        } else {
            alert('введите слово')
        }
    }

    findCurrentData = (data, dataIdx) => {
        return data.find((wordData, idx) => idx === dataIdx);
    }

    handleInputChange = (value) => {
        this.setState({
            inputValue: value,
            isGuessCheck: false
        })
    }

    handleSubmit(evt) {
        evt.preventDefault();
    }

    handleImgLoading = () => {
        this.setState({
            isImageLoaded: true
        })
    }

    render() {
        let progressValue = Math.round(this.state.wordsPerGame / this.state.fullData.length * 100);
        let imageSrc = `https://raw.githubusercontent.com/22-22/rslang/rslang-data/data/${this.state.currentData.image}`;
        return (
            <div className={this.state.isImageLoaded ? "test__game-container" : "test__game-container hidden"}>
                {(this.state.isImageLoaded && this.state.wordsPerGame === this.state.fullData.length) ? (
                    <div className="game-end">
                        <h1>Спасибо за прохождение теста!</h1>
                        <div className="test__info">Это поможет нам подобрать наиболее подходящие для вас слова!</div>
                        <div className="test__info">Правильные ответы: {this.state.correctGuessesPercent}%</div>
                    </div>
                ) : ''}
                <div className="test__word-card">
                    <img className="test__image" onLoad={this.handleImgLoading} src={imageSrc} alt=""></img>
                    <div className="test__word-container">
                        <div className="test__word">{this.state.currentData.wordTranslate}</div>
                        <form className="test__form" onSubmit={this.handleSubmit}>
                            <LettersInput isGuessCheck={this.state.isGuessCheck} word={this.state.currentWord}
                                inputAttempt={this.state.inputAttempt} value={this.state.inputValue}
                                handleInputChange={this.handleInputChange} coloredLetters={this.state.coloredLetters}
                            />
                            <button className="test__btn btn" onClick={this.onClickFurther}>Дальше</button>
                        </form>
                    </div>
                </div>
                <div className="test__progress-container">
                    <span>{this.state.wordsPerGame}</span>
                    <progress className="progress-current" max="100" value={progressValue}></progress>
                    <span>{this.state.fullData.length}</span>
                </div>
            </div>
        )
    }
}

export default Test;