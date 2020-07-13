import React from 'react';
import {
    getUserWord, createUserWord, updateUserWord, addSettingsUser,
    getSettingsUser, getWordById, getNewWords,
    getAllUserWords, getStatisticsUser, updateStatisticsUser
} from '../ServerRequest/ServerRequests';
import Card from './Card';

import mainImg from './assets/main.jpg';
import starImg from './assets/star.png';
import mic from './assets/mic.png';

import './Game1.css';

const easyInterval = 3;
const goodInterval = 2;
const hardInterval = 1;
const wordsPerGame = 10;
const dataUrl = 'https://raw.githubusercontent.com/22-22/rslang/rslang-data/data/';
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'en-US';

function startListening() {
    recognition.start();
}

class Game1 extends React.Component {
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
            userChoiceMode: false,
            pageUserChoice: '',
            levelUserChoice: '',
        }
    }

    componentDidMount = async () => {
        let { optional: { level, page, wordsLearntPerPage } } = await getSettingsUser();
        this.setState({
            level,
            page,
            wordsLearntPerPage
        }, this.startGame);
    }

    componentWillUnmount = () => {
        recognition.removeEventListener('end', startListening);
        recognition.stop();
        if (this.state.correctGuess.length > 0) {
            this.updateIncorrectGuesses();
            this.handleSettingsUpdate();
            this.sendStats();
        }
    }

    updateIncorrectGuesses = () => {
        let incorrectGuess = this.filterIncorrectGuess();
        this.setState({
            incorrectGuess
        })
        let diffLevel = "hard";
        if (incorrectGuess) {
            incorrectGuess.map(word => this.handleUserWordUpdate(diffLevel, word.id))
        }
    }

    startGame = async () => {
        let fullData = [];
        let { wordsLearntPerPage, page, level } = this.state;
        const userWords = await getAllUserWords();
        if (userWords.length === 0 || !userWords) {
            this.startGameWithNewWords();
        } else {
            const wordsForGame = this.filterUserWords(userWords);
            if (wordsForGame.length === 0 || !userWords) {
                this.startGameWithNewWords();
            } else {
                const promises = wordsForGame.map(async (word) => await getWordById(word.wordId));
                fullData = await Promise.all(promises);
                if (fullData.length < wordsPerGame) {
                    if (page > 29) {
                        level++;
                        page = 0;
                        wordsLearntPerPage = 0;
                    }
                    const wordsNeeded = wordsPerGame - fullData.length;
                    const extraData = await getNewWords(page, level);
                    extraData.filter((data, idx) => {
                        if (!fullData.some(word => word.id === data.id)) {
                            if (idx >= wordsLearntPerPage && idx < (wordsLearntPerPage + wordsNeeded)) {
                                fullData.push(data);
                            }
                        }
                    })
                    if (fullData.length < wordsPerGame) {
                        page++;
                        if (page > 29) {
                            level++;
                            page = 0;
                        }
                        wordsLearntPerPage = 0;
                        const wordsNeeded = wordsPerGame - fullData.length;
                        const extraData = await getNewWords(page, level);
                        extraData.filter((data, idx) => {
                            if (!fullData.some(word => word.id === data.id)) {
                                if (idx >= wordsLearntPerPage && idx < (wordsLearntPerPage + wordsNeeded)) {
                                    fullData.push(data);
                                }
                            }
                        })
                        this.setState({
                            page,
                            wordsLearntPerPage: wordsNeeded
                        })
                    }
                }
            }
        }
        this.setState({
            fullData,
        })
    }

    startGameWithNewWords = async () => {
        let { userChoiceMode, wordsLearntPerPage, page, level, pageUserChoice, levelUserChoice } = this.state;
        if (page > 29) {
            level++;
            page = 0;
            wordsLearntPerPage = 0;
        }
        let currentLevel = userChoiceMode ? (levelUserChoice - 1) : level;
        let currentPage = userChoiceMode ? (pageUserChoice - 1) : page;
        let wordsCount = userChoiceMode ? 0 : wordsLearntPerPage;
        let fullData = [];
        let fullDataPerPage = await getNewWords(currentPage, currentLevel);
        fullData = fullDataPerPage.filter((data, idx) => {
            if (idx >= wordsCount && (idx < (wordsCount + wordsPerGame))) {
                return data;
            }
        })
        if (fullData.length < wordsPerGame) {
            page++;
            if (page > 29) {
                level++;
                page = 0;
            }
            wordsLearntPerPage = 0;
            const wordsNeeded = wordsPerGame - fullData.length;
            const extraData = await getNewWords(page, level);
            extraData.filter((data, idx) => {
                if (!fullData.some(word => word.id === data.id)) {
                    if (idx >= wordsLearntPerPage && idx < (wordsLearntPerPage + wordsNeeded)) {
                        fullData.push(data);
                    }
                }
            })
            this.setState({
                page,
                wordsLearntPerPage: wordsNeeded
            })
        }
        this.setState({
            fullData
        })
    }

    filterUserWords = (userWords) => {
        const currentDate = new Date();
        let wordsForGame = [];
        userWords.filter(word => {
            let { deleted, hardWord, nextTrain } = word.optional;
            if (!deleted && !hardWord && nextTrain <= +currentDate && wordsForGame.length < wordsPerGame) {
                wordsForGame.push(word);
            }
        });
        return wordsForGame;
    }

    sendStats = () => {
        getStatisticsUser().then(data => {
            data.optional["speakIt"][`${+new Date()}`] = {
                "errors": this.state.incorrectGuess.length,
                "trues": this.state.correctGuess.length
            };
            delete data.id;
            let stat = data;
            updateStatisticsUser(stat);
        })
    }

    handleSettingsUpdate = async () => {
        let oldSettings = await getSettingsUser();
        let { page, level, wordsLearntPerPage } = this.state;
        let newSettings = { ...oldSettings, optional: { ...oldSettings.optional, page, level, wordsLearntPerPage } }
        delete newSettings.id;
        addSettingsUser(newSettings);
    }

    prepareForNewGame = () => {
        if (this.state.correctGuess.length > 0) {
            this.updateIncorrectGuesses();
            this.sendStats();
        }
        recognition.removeEventListener('end', startListening);
        recognition.stop();
        this.setState({
            currentObj: '',
            inputValue: '',
            correctGuess: [],
            incorrectGuess: [],
            isRecognition: false,
            isStatistics: false,
        })
        if (this.state.userChoiceMode) {
            this.startGameWithNewWords();
        } else {
            this.startGame();
        }
    }

    changeLevel = () => {
        if (this.state.pageUserChoice > 0 && this.state.levelUserChoice > 0) {
            this.setState({
                userChoiceMode: true
            }, this.prepareForNewGame)
        } else {
            alert('level 1 - 6, page 1 - 30');
        }
    }

    startNextGame = () => {
        this.setState({
            userChoiceMode: false
        })
        this.prepareForNewGame();
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
            <img className="speakit__image" src={src} alt=""></img>
            <div className="speakit__translation">{wordTranslate}</div>
        </div>);
    }

    updateImage = (src) => {
        return (<div>
            <img className="speakit__image" src={src} alt=""></img>
        </div>)
    }

    checkGuess = () => {
        let inputValue = this.state.inputValue;
        let firstChar = inputValue.charAt(0);
        let converted = (firstChar.toUpperCase() === firstChar)
            ? firstChar.toLowerCase() : firstChar.toUpperCase()
        let inputValueConverted = converted + inputValue.slice(1);
        let correctWord = this.state.fullData.find(wordObj =>
            wordObj.word === inputValue || wordObj.word === inputValueConverted);
        if (correctWord) {
            this.setState(prevState => ({
                correctGuess: [...prevState.correctGuess, correctWord],
                currentObj: correctWord
            }))
            let diffLevel = "good";
            let wordId = this.state.currentObj.id;
            this.handleUserWordUpdate(diffLevel, wordId);
        }
        if (this.state.correctGuess.length === 10) {
            this.setState({
                isStatistics: true,
            })
            this.sendStats();
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
            startListening();
            this.handleRecognition();
            recognition.addEventListener('end', startListening);
        }
    }

    handleCardClick = (e) => {
        if (!this.state.isRecognition) {
            let currId = e.target.closest('.speakit__card').dataset.id;
            let currentObj = this.state.fullData.find(el => el.id === currId);
            this.setState({
                currentObj
            })
            this.playSound(currentObj.audio);
        }
    }

    handleInputChange = (event) => {
        const target = event.target;
        const value = target.name === 'levelUserChoice' ? +target.value : +target.value;
        const name = target.name;
        if ((target.name === 'pageUserChoice' && target.value <= 30 && target.value > 0)
            || (target.name === 'levelUserChoice' && target.value <= 6 && target.value > 0)
            || (target.value === '')) {
            this.setState({
                [name]: value
            })
        } else {
            alert('level 1 - 6, page 1 - 30');
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
        if (this.state.correctGuess.length > 0) {
            this.updateIncorrectGuesses();
            this.sendStats();
        }
        recognition.removeEventListener('end', startListening);
        recognition.stop();
        this.setState({
            currentObj: '',
            inputValue: '',
            correctGuess: [],
            incorrectGuess: [],
            isRecognition: false,
            isStatistics: false,
        })
    }

    handleUserWordUpdate = async (diffLevel, wordId) => {
        let word = await getUserWord(wordId);
        let lastTrain = +new Date();
        if (!word) {
            let interval = (diffLevel === 'good') ? goodInterval : hardInterval;
            let nextTrain;
            if (diffLevel === 'good') {
                nextTrain = new Date().setDate(new Date().getDate() + interval);
            } else {
                nextTrain = lastTrain;
            }
            let newWord = {
                "difficulty": diffLevel,
                "optional": {
                    "deleted": false,
                    "hardWord": false,
                    "repeatsStreak": 1,
                    "repeatsTotal": 1,
                    "addingDate": lastTrain,
                    lastTrain,
                    nextTrain
                }
            }
            console.log('1', newWord)

            createUserWord(wordId, newWord);
        } else {
            let interval;
            switch (word.difficulty) {
                case 'hard':
                    interval = word.optional.repeatsStreak * hardInterval;
                    break;
                case 'good':
                    interval = word.optional.repeatsStreak * goodInterval;
                    break;
                case 'easy':
                    interval = word.optional.repeatsStreak * easyInterval;
                    break;
                default:
                    interval = 0;
                    break;
            }
            let nextTrain;
            if (diffLevel === 'good') {
                nextTrain = new Date().setDate(new Date().getDate() + interval);
            } else {
                nextTrain = lastTrain;
            }
            let repeatsStreak = word.optional.repeatsStreak + 1;
            let repeatsTotal = word.optional.repeatsTotal + 1;
            let newWord = { ...word, optional: { ...word.optional, repeatsStreak, repeatsTotal, lastTrain, nextTrain } }
            delete newWord.id;
            delete newWord.wordId;
            updateUserWord(wordId, newWord);
        }
    }

    render() {
        const resultBlock = (this.state.currentObj && !this.state.isRecognition)
            ? this.showResult()
            : (this.state.isRecognition && this.state.correctGuess.length > 0)
                ? (this.updateImage(`${dataUrl}${this.state.currentObj.image}`))
                : this.updateImage(mainImg)
        return (
            <div className="speakit__app">
                <div onClick={this.openGame}
                    className={this.state.isGameStarted
                        ? "speakit__start-screen speakit__hidden" : "speakit__start-screen"}>
                    <h1 className="speakit__start-name">speakit</h1>
                    <p className="speakit__start-info">Click on the words to hear them sound.
                        Click on the button and speak the words into the microphone.</p>
                    <button className="speakit__start-button">start</button>
                </div>
                <div className={(this.state.isStatistics) ? "speakit__game speakit__hidden" : "speakit__game"}>
                    <div className="speakit__header">
                        <div className="speakit__inputs-container">
                            <label>Level
                        <input type="text" name="levelUserChoice"
                                    autoComplete="off"
                                    value={this.state.levelUserChoice}
                                    onChange={this.handleInputChange}
                                    className="speakit__settings-inputs"></input>
                            </label>
                            <label>Page
                        <input type="text" name="pageUserChoice"
                                    autoComplete="off"
                                    value={this.state.pageUserChoice}
                                    onChange={this.handleInputChange}
                                    className="speakit__settings-inputs"></input>
                            </label>
                            <button className="speakit__btn speakit__btn-small"
                                onClick={this.changeLevel}>Go!</button>
                        </div>
                        {this.state.correctGuess.length > 0 &&
                            (<div className="speakit__rating">
                                {this.state.correctGuess.map((el, idx) => <img className="speakit__star"
                                    key={idx} src={starImg} alt="star"></img>)}
                            </div>
                            )
                        }
                    </div>
                    <main className="speakit__main">
                        <div className="speakit__result-card">
                            <input value={this.state.inputValue} readOnly
                                className={this.state.isRecognition ? "speakit__input-speech"
                                    : "speakit__input-speech speakit__hidden"} type="text">
                            </input>
                            <img src={mic} className={this.state.isRecognition ?
                                "speakit__mic" : "speakit__mic speakit__hidden"} alt="mic"></img>
                            {resultBlock}
                        </div>
                        <div className="speakit__cards">
                            {
                                this.state.fullData.map(wordObj =>
                                    <Card currentObj={this.state.currentObj} wordObj={wordObj}
                                        key={wordObj.id} isStatistics={this.state.isStatistics}
                                        onCardClick={this.handleCardClick} />)
                            }
                        </div>
                        <div className="speakit__btns">
                            <span onClick={this.restartCurrentGame}
                                className="speakit__btn">Restart</span>
                            <span onClick={this.startRecognition}
                                className="speakit__btn speakit__btn-wide">Speak please</span>
                            <span className="speakit__btn speakit__btn-results"
                                onClick={this.openStats}>Results</span>
                        </div>
                    </main>
                </div>
                <div className={(this.state.isStatistics)
                    ? "speakit__results" : "speakit__results speakit__hidden"}>
                    <div className="speakit__results-container">
                        <p className="speakit__errors">Errors
                        <span className="speakit__errors-number">{this.state.incorrectGuess.length}</span>
                        </p>
                        <div>
                            {
                                this.state.incorrectGuess.map(wordObj =>
                                    <Card wordObj={wordObj} currentObj={this.state.currentObj}
                                        key={wordObj.id} isStatistics={this.state.isStatistics}
                                        playSound={this.playSound} onCardClick={this.handleCardClick}
                                    />
                                )
                            }
                        </div>
                        <p className="speakit__success">Correct
                        <span className="speakit__success-number">{this.state.correctGuess.length}</span>
                        </p>
                        <div className="speakit__success-items">
                            {
                                this.state.correctGuess.map(wordObj =>
                                    <Card wordObj={wordObj} currentObj={this.state.currentObj}
                                        key={wordObj.id} isStatistics={this.state.isStatistics}
                                        playSound={this.playSound}
                                        onCardClick={this.handleCardClick}
                                    />
                                )
                            }
                        </div>
                        <div className="speakit__results-btns">
                            <button className="speakit__btn speakit__btn-return"
                                onClick={this.closeStats}>Return</button>
                            <button className="speakit__btn speakit__btn-new-game"
                                onClick={this.startNextGame}>New Game</button>
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}

export default Game1;
