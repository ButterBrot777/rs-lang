import React from 'react';
import Card from './Card';
import LettersInput from './LettersInput';
import { getSettingsUser, getNewWords, getUserWord, createUserWord, updateUserWord } from './Requests'

import './index.css';

const userId = localStorage.getItem('userId');
const token = localStorage.getItem('token');
let user = {
    userId,
    token
}
const imageAudioUrl = 'https://raw.githubusercontent.com/22-22/rslang/rslang-data/data/';
const infoTextBtns = 'перевод, пример и значение: как минимум одна из настроек должна быть выбрана.'

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fullData: [],
            currentData: {},
            currentDataIdx: 0,
            currentWord: '',
            inputValue: '',
            isGuessed: false,
            isSkipped: false,
            isDifficultyChoice: false,
            wordsPerDay: 1,
            progressWords: 0,
            settings: {
                isMeaning: true,
                isTranslation: true,
                isImage: false,
                isTranscription: false,
                isExample: true,
                isSound: true,
            }
        }
        this.inputElem = React.createRef();
        this.wordContainerElem = React.createRef();
        this.infoElem = React.createRef();
        this.chooseDifficulty = this.chooseDifficulty.bind(this);
    }

    componentDidMount = async () => {
        let { wordsPerDay, optional } = await getSettingsUser(user);
        let fullData = await getNewWords(optional.Page, optional.Level, wordsPerDay)
        let currentData = this.findCurrentData(fullData, this.state.currentDataIdx);
        this.setState({
            fullData,
            currentData,
            currentWord: currentData.word,
            wordsPerDay
        })
    }

    findCurrentData = (data, dataIdx) => {
        return data.find((wordData, idx) => idx === dataIdx);
    }

    handleInputChange = (value) => {
        this.setState({
            inputValue: value
        })
    }

    toggleExample = () => {
        if (!this.state.settings.isExample
            || (this.state.settings.isExample && this.state.settings.isTranslation)
            || (this.state.settings.isExample && this.state.settings.isMeaning)) {
            this.setState({
                settings: {
                    ...this.state.settings,
                    isExample: !this.state.settings.isExample
                }
            })
        } else {
            this.infoElem.current.textContent = infoTextBtns;
            setTimeout(() => this.infoElem.current.textContent = '', 4000)
        }
    }

    toggleMeaning = () => {
        if (!this.state.settings.isMeaning
            || (this.state.settings.isMeaning && this.state.settings.isTranslation)
            || (this.state.settings.isMeaning && this.state.settings.isExample)) {
            this.setState({
                settings: {
                    ...this.state.settings,
                    isMeaning: !this.state.settings.isMeaning
                }
            })
        } else {
            this.infoElem.current.textContent = infoTextBtns
            setTimeout(() => this.infoElem.current.textContent = '', 4000)
        }
    }

    toggleTranslation = () => {
        if (!this.state.settings.isTranslation
            || (this.state.settings.isTranslation && this.state.settings.isExample)
            || (this.state.settings.isTranslation && this.state.settings.isMeaning)) {
            this.setState({
                settings: {
                    ...this.state.settings,
                    isTranslation: !this.state.settings.isTranslation
                }
            })
        } else {
            this.infoElem.current.textContent = infoTextBtns
            setTimeout(() => this.infoElem.current.textContent = '', 4000)
        }
    }

    toggleTranscription = () => {
        this.setState({
            settings: {
                ...this.state.settings,
                isTranscription: !this.state.settings.isTranscription
            }
        })
    }

    toggleImage = () => {
        this.setState({
            settings: {
                ...this.state.settings,
                isImage: !this.state.settings.isImage
            }
        })
    }

    toggleSound = () => {
        this.setState({
            settings: {
                ...this.state.settings,
                isSound: !this.state.settings.isSound
            }
        })
    }

    onShowAnswer = () => {
        this.setState({
            inputValue: ''
        })
        this.setState({
            isSkipped: true,
            progressWords: this.state.progressWords + 1
        });
        this.wordContainerElem.current.classList.remove('hidden');
        setTimeout(() => this.goToNextCard(), 2000)
    }

    playSound = () => {
        let pathWord = this.state.currentData.audio;
        let pathExample = this.state.currentData.audioExample;
        let pathMeaning = this.state.currentData.audioMeaning;
        let fullPathWord = `${imageAudioUrl}${pathWord}`
        let fullPathExample = `${imageAudioUrl}${pathExample}`
        let fullPathMeaning = `${imageAudioUrl}${pathMeaning}`
        let audioWord = new Audio(fullPathWord);
        let audioExample = new Audio(fullPathExample);
        let audioMeaning = new Audio(fullPathMeaning);
        audioWord.play();
        if (this.state.settings.isExample && this.state.settings.isMeaning) {
            audioWord.onended = function () {
                audioExample.play();
                audioExample.onended = function () {
                    audioMeaning.play();
                }
            }
            return audioMeaning;
        } else if (this.state.settings.isExample) {
            audioWord.onended = function () {
                audioExample.play();
            }
            return audioExample;
        } else if (this.state.settings.isMeaning) {
            audioWord.onended = function () {
                audioMeaning.play();
            }
            return audioMeaning;
        } else {
            return audioWord;
        }
    }

    onClickFurther = () => {
        if (this.state.inputValue !== '') {
            this.checkIfCorrectGuess();
        } else {
            this.infoElem.current.textContent = 'введите слово'
            setTimeout(() => this.infoElem.current.textContent = '', 3000)
        }
    }

    goToNextCard = () => {
        this.wordContainerElem.current.classList.add('hidden');
        this.removeLetterColors();
        let currentDataIdx = this.state.currentDataIdx + 1;
        let currentData = this.findCurrentData(this.state.fullData, currentDataIdx);
        this.setState({
            isGuessed: false,
            isSkipped: false,
            currentWord: currentData.word,
            currentDataIdx,
            currentData,
        })
    }

    removeLetterColors = () => {
        Array.from(this.wordContainerElem.current.children).forEach((letterElem) => {
            letterElem.classList.remove('correct');
            letterElem.classList.remove('incorrect');
        });
    }

    handleIncorrectAnswer = () => {
        this.wordContainerElem.current.classList.remove('hidden');
        this.inputElem.current.blur();
        this.inputElem.current.addEventListener('focus', () => {
            this.wordContainerElem.current.classList.add('hidden');
        }, { once: true });
        setTimeout(this.removeLetterColors, 2000)
    }

    checkIfCorrectGuess = () => {
        let attempt = this.state.inputValue.split('');
        let correctLetters = 0;
        Array.from(this.wordContainerElem.current.children).forEach((letterElem, idx) => {
            if (letterElem.textContent === attempt[idx]) {
                letterElem.classList.add('correct');
                correctLetters += 1;
            } else {
                letterElem.classList.add('incorrect');
            }
            return correctLetters; 
        });
        this.setState({
            inputValue: ''
        });
        if (correctLetters === this.wordContainerElem.current.children.length) {
            this.setState({
                isGuessed: true,
                progressWords: this.state.progressWords + 1
            });
            if (this.state.settings.isSound) {
                this.playSound().addEventListener('ended', () => {
                    this.setState({
                        isDifficultyChoice: true
                    })
                });

            } else {
                this.setState({
                    isDifficultyChoice: true
                })
            }
        } else {
            this.handleIncorrectAnswer();
        }
    }

    handleSubmit(evt) {
        evt.preventDefault();
    }

    addToDeleted() {
        // getUserWords
        // if word in userWords - updateUserWord (deleted: true)
        // else - createUserWords (deleted: true)
    }

    chooseDifficulty = async (diffLevel) => {
        let lastTrain = new Date().toLocaleDateString();
        let newWord = {
            userId: user.userId,
            wordId: this.state.currentData.id,
            word: {
                "difficulty": diffLevel,
                "optional": {
                    "deleted": false,
                    lastTrain,
                }
            }
        }
        let word = await getUserWord(this.state.currentData.id, user);
        if (!word) {
            createUserWord(newWord)
        } else {
            updateUserWord(newWord)
        }
        this.setState({
            isDifficultyChoice: false,
        })
        this.goToNextCard();
    }

    render() {
        let translationBlock = (this.state.settings.isTranslation && this.state.isGuessed)
            ? this.state.currentData.wordTranslate : '';
        let progressValue = this.state.progressWords / this.state.wordsPerDay * 100;

        return (
            <div className="game-container">
                <header className="header">
                    <div className="incorrect" ref={this.infoElem}></div>
                    <div className="btns-container">
                        <button className={this.state.settings.isTranslation ? "btn" : "btn opaque"} onClick={this.toggleTranslation}>перевод</button>
                        <button className={this.state.settings.isMeaning ? "btn" : "btn opaque"} onClick={this.toggleMeaning}>значение</button>
                        <button className={this.state.settings.isExample ? "btn" : "btn opaque"} onClick={this.toggleExample}>пример</button>
                        <button className={this.state.settings.isTranscription ? "btn" : "btn opaque"} onClick={this.toggleTranscription}>транскрипция</button>
                        <button className={this.state.settings.isImage ? "btn" : "btn opaque"} onClick={this.toggleImage}>картинка</button>
                        <button className={this.state.settings.isSound ? "btn" : "btn opaque"} onClick={this.toggleSound}>звук</button>
                    </div>
                </header>
                {/* {this.state.progressWords === this.state.wordsPerDay ? <div>Ура, на сегодня все!</div> : */}
                <Card
                    wordData={this.state.currentData}
                    settings={this.state.settings}
                    isGuessed={this.state.isGuessed}
                    isSkipped={this.state.isSkipped}
                />
                {
                    this.state.isDifficultyChoice ? '' : (
                        <div>
                            <form onSubmit={this.handleSubmit}>
                                <LettersInput
                                    inputRef={this.inputElem} wordContainerRef={this.wordContainerElem} value={this.state.inputValue}
                                    word={this.state.currentWord} handleInputChange={this.handleInputChange}
                                />
                                <div>{translationBlock}</div>
                                <button className="btn" onClick={this.onClickFurther}>Дальше</button>
                            </form>
                            <button className="btn" onClick={this.onShowAnswer}>Показать ответ</button>
                        </div>
                    )
                }
                {
                    this.state.isDifficultyChoice ?
                        (<div className="btns-container">
                            <button className="btn" >Снова</button>
                            <button className="btn" onClick={this.chooseDifficulty.bind(this, 'hard')}>Трудно</button>
                            <button className="btn" onClick={this.chooseDifficulty.bind(this, 'good')}>Хорошо</button>
                            <button className="btn" onClick={this.chooseDifficulty.bind(this, 'easy')}>Легко</button>
                        </div>) : ''

                }
                <div className="btns-container">
                    <button className="btn" onClick={this.addToDeleted}>Удалить</button>
                    <button className="btn" >Сложные</button>
                </div>
                <div className="progress-container">
                    <span>{this.state.progressWords}</span>
                    <progress className="progress-current" max="100" value={progressValue}></progress>
                    <span>{this.state.wordsPerDay}</span>
                </div>
            </div>
        )
    }
}

export default Game;
