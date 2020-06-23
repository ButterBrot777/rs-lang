import React from 'react';
import Card from './Card';
import Input from './Input';
import ButtonsSettings from './ButtonsSettings';

import './index.css';

// get from the back
let newWords = 20;
let page = 0;
let group = 2;

const wordsPerSent = 12; // we can choose
const baseUrl = 'https://afternoon-falls-25894.herokuapp.com';
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
    }

    componentDidMount = () => {
        const url = `${baseUrl}/words?page=${page}&group=${group}
        &wordsPerExampleSentenceLTE=${wordsPerSent}&wordsPerPage=${newWords}`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                let currentData = this.findCurrentData(data, this.state.currentDataIdx);
                this.setState({
                    fullData: data,
                    currentData,
                    currentWord: currentData.word,
                })
            });
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
            isSkipped: true
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
                isGuessed: true
            });
            if (this.state.settings.isSound) {
                this.playSound().addEventListener('ended', this.goToNextCard);
            } else {
                setTimeout(() => {
                    this.goToNextCard()
                }, 2000)
            }
        } else {
            this.handleIncorrectAnswer();
        }
    }

    handleSubmit(evt) {
        evt.preventDefault();
    }

    render() {
        let translationBlock = (this.state.settings.isTranslation && this.state.isGuessed) 
        ? this.state.currentData.wordTranslate : '';
        return (
            <div className="game-container">
                <header className="header">
                    <div className="incorrect" ref={this.infoElem}></div>
                    <ButtonsSettings
                        settings={this.state.settings}
                        toggleExample={this.toggleExample} toggleMeaning={this.toggleMeaning}
                        toggleTranslation={this.toggleTranslation} toggleImage={this.toggleImage}
                        toggleTranscription={this.toggleTranscription} toggleSound={this.toggleSound}
                    />
                </header>
                <Card
                    wordData={this.state.currentData}
                    settings={this.state.settings}
                    isGuessed={this.state.isGuessed}
                    isSkipped={this.state.isSkipped}
                />
                <form onSubmit={this.handleSubmit}>
                    <Input
                        inputRef={this.inputElem} wordContainerRef={this.wordContainerElem} value={this.state.inputValue}
                        word={this.state.currentWord} handleInputChange={this.handleInputChange}
                    />
                    <div>{translationBlock}</div>
                    <button className="btn" onClick={this.onClickFurther}>дальше</button>
                </form>
                <button className="btn" onClick={this.onShowAnswer}>показать ответ</button>
            </div>
        )
    }
}

export default Game;
