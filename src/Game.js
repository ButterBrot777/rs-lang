import React from 'react';
import Card from './Card';
import LettersInput from './LettersInput';
import { addSettingsUser, getSettingsUser, getNewWords, getUserWord, createUserWord, updateUserWord } from './Requests'

import './index.css';

// localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlZWM2YmY3OThmZmJmMDAxNzQ1ODJmOSIsImlhdCI6MTU5MzM0MDgxMCwiZXhwIjoxNTkzMzU1MjEwfQ.NnDEu97ZOtZSh3lhYwriqiaqkIeNXrEfC78FzoTGnkQ')

const userId = localStorage.getItem('userId');
const token = localStorage.getItem('token');
let user = {
    userId,
    token
}
const imageAudioUrl = 'https://raw.githubusercontent.com/22-22/rslang/rslang-data/data/';
const infoTextBtns = 'перевод, пример и значение: как минимум одна из настроек должна быть выбрана.';
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
            wordsLearntPerGame: 0,
            correctGuesses: 0,
            correctGuessesStrike: 0,
            settings: {
                isMeaning: true,
                isTranslation: true,
                isImage: false,
                isTranscription: false,
                isExample: true,
                isSound: false,
            }
        }
        this.inputElem = React.createRef();
        this.wordContainerElem = React.createRef();
        this.infoElem = React.createRef();
        this.chooseDifficulty = this.chooseDifficulty.bind(this);
    }

    componentDidMount = async () => {
        let { wordsPerDay, optional: { level, page, wordsLearntPerPage } } = await getSettingsUser(user);
        if (page > 29 && level < 6) {
            level++;
            page = 0;
        }
        let fullDataPerPage = await getNewWords(page, level);
        let fullData = fullDataPerPage.filter((data, idx) => {
            
            if (idx >= wordsLearntPerPage && (idx < (wordsLearntPerPage + wordsPerDay))) {
                return data;
            }
            // return null;
        })
        if (fullData.length < wordsPerDay) {
            let wordsNeeded = wordsPerDay - fullData.length;
            if (page >= 29 && level < 6) {
                level++;
                page = 0;
            } else {
                page++;
                console.log(page)
            }
            let extraData = await getNewWords(page, level);
            extraData.filter((data, idx) => {
                if (idx < wordsNeeded) {
                    fullData.push(data);
                }
                // return null;
            })
        }
        let currentData = this.findCurrentData(fullData, this.state.currentDataIdx);
        this.setState({
            fullData,
            currentData,
            currentWord: currentData.word,
            wordsPerDay,
            level,
            page,
            wordsLearntPerPage,
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
            wordsLearntPerGame: this.state.wordsLearntPerGame + 1,
            correctGuessesStrike: 0,
        });
        this.wordContainerElem.current.classList.remove('hidden');
        setTimeout(() => {
            if (this.state.wordsLearntPerGame !== this.state.fullData.length) {
                this.goToNextCard();
            } else {
                this.handleSettingsUpdate();
            }
        }, 2000)
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
        this.setState({
            correctGuessesStrike: 0,
        });
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
                correctGuesses: this.state.correctGuesses + 1,
                correctGuessesStrike: this.state.correctGuessesStrike + 1,
                wordsLearntPerGame: this.state.wordsLearntPerGame + 1,
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

    addToHard() {
        // getUserWords
        // if word in userWords - updateUserWord (hardWord: true)
        // else - createUserWords (hardWord: true)
    }

    handleSettingsUpdate = () => {
        let { wordsPerDay, page, level, settings, wordsLearntPerPage, wordsLearntPerGame } = this.state;
        wordsLearntPerPage = wordsLearntPerPage + wordsLearntPerGame;
        if (wordsLearntPerPage > 20) {
            wordsLearntPerPage = wordsLearntPerPage - 20;
        } else if (wordsLearntPerPage === 20) {
            wordsLearntPerPage = 0;
            page++;
        }
        let newSettings = {
            // "wordsPerDay": this.props.wordsPerDay,
            "wordsPerDay": wordsPerDay,
            "optional": {
                //  "maxWordsPerDay": 30,
                "level": level,
                "page": page,
                "wordsLearntPerPage": wordsLearntPerPage,
                "meaningHint": settings.meaningHint,
                "translationHint": settings.translationHint,
                "exampleHint": settings.exampleHint,
                "soundHint": settings.soundHint,
                "imageHint": settings.imageHint,
                "transcriptionHint": settings.transcriptionHint,
            }
        };
        addSettingsUser(token, userId, newSettings);
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
        if (this.state.wordsLearntPerGame !== this.state.fullData.length) {
            this.goToNextCard();
        } else {
            this.handleSettingsUpdate();
        }
    }

    render() {
        let translationBlock = (this.state.settings.isTranslation && this.state.isGuessed)
            ? this.state.currentData.wordTranslate : '';
        let progressValue = Math.round(this.state.wordsLearntPerGame / this.state.fullData.length * 100);
        let correctGuessesPercent = Math.round(this.state.correctGuesses / this.state.fullData.length * 100);
        return (
            <div className="game-container">
                {(this.state.wordsLearntPerGame === this.state.fullData.length && !this.state.isDifficultyChoice) ? (
                    <div className="game-end">
                        <h1 className="info-big">Ура, на сегодня все!</h1>
                        <div className="info-small">Есть еще новые карточки, но дневной лимит исчерпан.</div>
                        <div>Карточек завершено: {this.state.wordsLearntPerGame}</div>
                        <div>Правильные ответы: {correctGuessesPercent}%</div>
                        <div>Новые слова: {this.state.wordsPerDay}</div>
                        <div> Самая длинная серия правильных ответов: {this.state.correctGuessesStrike}</div>
                        <button className="btn">Go back</button>
                    </div>
                ) : ''}
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
                            <button className="btn btn-colored" >Снова</button>
                            <button className="btn btn-colored" onClick={this.chooseDifficulty.bind(this, 'hard')}>Трудно</button>
                            <button className="btn btn-colored" onClick={this.chooseDifficulty.bind(this, 'good')}>Хорошо</button>
                            <button className="btn btn-colored" onClick={this.chooseDifficulty.bind(this, 'easy')}>Легко</button>
                        </div>) : ''

                }
                <div className="btns-container">
                    <button className="btn" onClick={this.addToDeleted}>Удалить</button>
                    <button className="btn" onClick={this.addToHard}>Сложные</button>
                </div>
                <div className="progress-container">
                    <span>{this.state.wordsLearntPerGame}</span>
                    <progress className="progress-current" max="100" value={progressValue}></progress>
                    <span>{this.state.fullData.length}</span>
                </div>
            </div>
        )
    }
}

export default Game;
