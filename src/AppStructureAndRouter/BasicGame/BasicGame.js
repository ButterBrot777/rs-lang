import React, { Component } from 'react';
import Card from './Card';
import LettersInput from './LettersInput';
import {
  addSettingsUser, getSettingsUser, getNewWords,
  getUserWord, createUserWord, updateUserWord, getAllUserWords, getWordById
} from '../ServerRequest/ServerRequests';
import { BrowserRouter as Router, Link } from "react-router-dom";
import Fade from 'react-reveal/Fade';
import './BasicGame.css'

const imageAudioUrl = 'https://raw.githubusercontent.com/22-22/rslang/rslang-data/data/';
const infoTextBtns = 'Перевод, пример и значение: как минимум одна из настроек должна быть выбрана.';
const easyInterval = 3;
const goodInterval = 2;
const hardInterval = 1;

class Game1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fullData: [],
      currentData: {},
      currentDataIdx: 0,
      currentWord: '',
      inputValue: '',
      inputAttempt: '',
      isGuessed: false,
      isSkipped: false,
      isDifficultyChoice: false,
      isGuessCheck: false,
      isStats: false,
      isImageLoaded: false,
      coloredLetters: false,
      wordsPerGame: 0,
      correctGuesses: 0,
      incorrectGuesses: 0,
      incorrectGuessesObj: [],
      correctGuessesStreak: 0,
      correctGuessesStreakTemp: 0,
      hints: {
        meaningHint: true,
        translationHint: true,
        imageHint: false,
        transcriptionHint: false,
        exampleHint: true,
        soundHint: false,
      },
      buttons: {
        showAnswer: true,
        addToDeleted: true,
        addToHard: false,
        chooseDifficulty: true,
      }
    }
  }

  componentDidMount = () => {
    let { hardWordsTraining, basicGameWords } = this.props;
    this.addSettingsToState().then(() => {
      if (hardWordsTraining) {
        this.startGameWithLearntWords()
          .then(() => this.addCurrentDataToState())
          .catch(() => document.location.href = '/HomePage')
      } else {
        if (basicGameWords === 'new') {
          this.startGameWithNewWords()
            .then(() => this.addCurrentDataToState())
            .catch(() => document.location.href = '/HomePage')
        } else if (basicGameWords === 'learned') {
          this.startGameWithLearntWords(this.state.maxWordsPerDay)
            .then(() => this.addCurrentDataToState())
            .catch(() => document.location.href = '/HomePage')
        } else {
          let wordLimit = this.state.maxWordsPerDay - this.state.wordsPerDay;
          this.startGameWithLearntWords(wordLimit);
          this.startGameWithNewWords()
            .then(() => this.addCurrentDataToState())
            .catch(() => document.location.href = '/HomePage')
        }
      }
    })
  }

  addSettingsToState = async () => {
    let settings = await getSettingsUser();
    if (!settings) {
      let date = new Date()
      date.setDate(date.getDate() - 1);
      let yesterday = date.toLocaleDateString();
      settings = {
        "wordsPerDay": 20,
        "optional": {
          "maxWordsPerDay": 40,
          "level": 0,
          "page": 0,
          "wordsLearntPerPage": 0,
          "lastTrain": yesterday,
          "hints": {
            "meaningHint": true,
            "translationHint": true,
            "exampleHint": true,
            "soundHint": false,
            "imageHint": false,
            "transcriptionHint": false
          }
        }
      }
    }
    let { wordsPerDay, optional: { maxWordsPerDay, level, page, wordsLearntPerPage, hints } } = settings;
    if (page >= 29 && level < 6) {
      level++;
      page = 0;
    } else {
      page++;
    }
    this.setState({
      wordsPerDay,
      level,
      page,
      wordsLearntPerPage,
      maxWordsPerDay,
      hints: {
        meaningHint: hints.meaningHint,
        translationHint: hints.translationHint,
        imageHint: hints.imageHint,
        transcriptionHint: hints.transcriptionHint,
        exampleHint: hints.exampleHint,
        soundHint: hints.soundHint,
      }
    })
  }

  startGameWithNewWords = async () => {
    let { page, level, wordsLearntPerPage, wordsPerDay, maxWordsPerDay } = this.state;
    let wordsLimit = Math.min(wordsPerDay, maxWordsPerDay);
    let fullDataPerPage = await getNewWords(page, level);
    let fullData = fullDataPerPage.filter((data, idx) => {
      if (idx >= wordsLearntPerPage && (idx < (wordsLearntPerPage + wordsLimit))) {
        return data;
      }
    })
    if (fullData.length < wordsLimit) {
      let wordsNeeded = wordsLimit - fullData.length;
      let extraData = await getNewWords(page, level);
      extraData.filter((data, idx) => {
        if (idx < wordsNeeded) {
          fullData.push(data);
        }
      })
    }
    this.setState({
      fullData: this.state.fullData.concat(fullData)
    })
  }

  handleNoWords = () => {
    let { basicGameWords, hardWordsTraining } = this.props;
    if (basicGameWords === 'learned') {
      alert('Sorry, you do not have words to repeat, please choose New words mode on the Home page.');
    } else if (hardWordsTraining) {
      alert('Sorry, you do not have Hard words to repeat');
      document.location.href = '/HomePage';
    } else if (basicGameWords === 'combined') {
      alert('Please note that you only have new words to learn');
      return;
    }
  }

  startGameWithLearntWords = async (maxWordsPerDay) => {
    const userWords = await getAllUserWords();
    if (userWords.length === 0 || !userWords) {
      this.handleNoWords()
    } else {
      const wordsForGame = this.filterUserWords(maxWordsPerDay, userWords);
      if (wordsForGame.length === 0) {
        this.handleNoWords();
      } else {
        const promises = wordsForGame.map(async (word) => await getWordById(word.wordId))
        const fullData = await Promise.all(promises);
        this.setState({
          fullData: this.state.fullData.concat(fullData)
        })
      }
    }
  }

  addCurrentDataToState = () => {
    let { fullData, currentDataIdx } = this.state;
    let currentData = this.findCurrentData(fullData, currentDataIdx);
    this.setState({
      currentData,
      currentWord: currentData.word,
    })
  }

  filterUserWords = (wordsLimit, userWords) => {
    const currentDate = new Date();
    let wordsForGame = [];
    if (this.props.hardWordsTraining) {
      wordsForGame = userWords.filter(word => word.optional.hardWord);
    } else {
      userWords.filter(word => {
        let { deleted, hardWord, nextTrain } = word.optional;
        if (!deleted && !hardWord && nextTrain <= +currentDate && wordsForGame.length < wordsLimit) {
          wordsForGame.push(word);
        }
      });
    }
    return wordsForGame;
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

  handleImgLoading = () => {
    this.setState({
      isImageLoaded: true
    })
  }

  handleCheckboxChange = (event) => {
    const target = event.target;
    const value = target.name === 'addToDeleted' ? target.checked : 'addToHard'
      ? target.checked : 'showAnswer' ? target.checked : 'chooseDifficulty';
    const name = target.name;
    if (!(name === 'chooseDifficulty' && this.state.isDifficultyChoice)) {
      this.setState({
        buttons: {
          ...this.state.buttons,
          [name]: value
        }
      });
    }
  }

  toggleExampleHint = () => {
    if (!this.state.hints.exampleHint
      || (this.state.hints.exampleHint && this.state.hints.translationHint)
      || (this.state.hints.exampleHint && this.state.hints.meaningHint)) {
      this.setState({
        hints: {
          ...this.state.hints,
          exampleHint: !this.state.hints.exampleHint
        }
      })
    } else {
      alert(infoTextBtns);
    }
  }

  toggleMeaningHint = () => {
    if (!this.state.hints.meaningHint
      || (this.state.hints.meaningHint && this.state.hints.translationHint)
      || (this.state.hints.meaningHint && this.state.hints.exampleHint)) {
      this.setState({
        hints: {
          ...this.state.hints,
          meaningHint: !this.state.hints.meaningHint
        }
      })
    } else {
      alert(infoTextBtns)
    }
  }

  toggleTranslationHint = () => {
    if (!this.state.hints.translationHint
      || (this.state.hints.translationHint && this.state.hints.exampleHint)
      || (this.state.hints.translationHint && this.state.hints.meaningHint)) {
      this.setState({
        hints: {
          ...this.state.hints,
          translationHint: !this.state.hints.translationHint
        }
      })
    } else {
      alert(infoTextBtns)
    }
  }

  toggleTranscriptionHint = () => {
    this.setState({
      hints: {
        ...this.state.hints,
        transcriptionHint: !this.state.hints.transcriptionHint
      }
    })
  }

  toggleImageHint = () => {
    this.setState({
      hints: {
        ...this.state.hints,
        imageHint: !this.state.hints.imageHint
      }
    })
  }

  toggleSoundHint = () => {
    this.setState({
      hints: {
        ...this.state.hints,
        soundHint: !this.state.hints.soundHint
      }
    })
  }

  countGuessStreak = () => {
    let longestStreak;
    if (this.state.correctGuessesStreak > this.state.correctGuessesStreakTemp) {
      longestStreak = this.state.correctGuessesStreak;
    } else {
      longestStreak = this.state.correctGuessesStreakTemp;
    }
    return longestStreak;
  }

  onShowAnswer = () => {
    if (!this.state.isGuessed && !this.state.isDifficultyChoice && !this.state.isSkipped) {
      this.setState({
        inputValue: ''
      })
      let longestStreak = this.countGuessStreak();
      this.setState({
        isSkipped: true,
        isGuessCheck: false,
        wordsPerGame: this.state.wordsPerGame + 1,
        correctGuessesStreakTemp: longestStreak,
        correctGuessesStreak: 0,
      });
      this.updateDifficultyStats('hard', false, false);
      setTimeout(() => {
        this.continueGame();
      }, 2000)
    }
  }

  playSound = (url) => {
    return new Promise((resolve, reject) => {
      let audio = new Audio(url);
      audio.play();
      audio.onended = resolve;
      audio.onerror = reject;
    })
  }

  onClickFurther = () => {
    if (this.state.inputValue !== '') {
      this.setState({
        isGuessCheck: true,
        coloredLetters: true
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

  goToNextCard = () => {
    let currentDataIdx = this.state.currentDataIdx + 1;
    let currentData = this.findCurrentData(this.state.fullData, currentDataIdx);
    this.setState({
      isImageLoaded: false,
      isGuessed: false,
      isSkipped: false,
      currentWord: currentData.word,
      currentDataIdx,
      currentData,
    })
  }

  handleIncorrectAnswer = () => {
    let sameWord = this.state.fullData.filter(wordObj => wordObj === this.state.currentData)
    let longestStreak = this.countGuessStreak();
    if (sameWord.length < 2) {
      this.setState(prevState => ({
        fullData: [...prevState.fullData, this.state.currentData],
        correctGuessesStreakTemp: longestStreak,
        correctGuessesStreak: 0,
        incorrectGuesses: this.state.incorrectGuesses + 1,
        incorrectGuessesObj: [...prevState.incorrectGuessesObj, this.state.currentData]
      }));
      this.updateDifficultyStats('hard', false, false);
    }
  }

  handleStateAfterSound = () => {
    if (this.state.buttons.chooseDifficulty) {
      this.setState({
        isGuessed: false,
        wordsPerGame: this.state.wordsPerGame + 1,
        isDifficultyChoice: true,
      })
    } else {
      this.setState({
        wordsPerGame: this.state.wordsPerGame + 1,
      })
      this.continueGame();
    }
  }

  checkIfCorrectGuess = () => {
    this.setState({
      inputAttempt: this.state.inputValue,
      inputValue: ''
    })
    let inputAttempt = this.state.inputValue.split('');
    let currentWord = this.state.currentWord.split('');
    let correctLetters = 0;
    currentWord.forEach((letter, idx) => {
      if (letter === inputAttempt[idx]) {
        correctLetters += 1;
      }
    })
    if (correctLetters === currentWord.length) {
      this.setState({
        isGuessCheck: false,
        isGuessed: true,
        correctGuesses: this.state.correctGuesses + 1,
        correctGuessesStreak: this.state.correctGuessesStreak + 1,
      });
      if (this.state.hints.soundHint) {
        let { audio, audioExample, audioMeaning } = this.state.currentData;
        this.playSound(`${imageAudioUrl}${audio}`)
          .then(result => {
            if (this.state.hints.exampleHint && this.state.hints.meaningHint) {
              this.playSound(`${imageAudioUrl}${audioExample}`)
                .then(res => this.playSound(`${imageAudioUrl}${audioMeaning}`))
                .then(res => this.handleStateAfterSound())
            } else if (this.state.hints.meaningHint) {
              this.playSound(`${imageAudioUrl}${audioMeaning}`)
                .then(res => this.handleStateAfterSound())
            } else if (this.state.hints.exampleHint) {
              this.playSound(`${imageAudioUrl}${audioExample}`)
                .then(res => this.handleStateAfterSound())
            } else {
              this.handleStateAfterSound();
            }
          })
      } else {
        this.setState({
          wordsPerGame: this.state.wordsPerGame + 1,
        })
        if (this.state.buttons.chooseDifficulty) {
          this.setState({
            isGuessed: false,
            isDifficultyChoice: true,
          })
        } else {
          let incorrect = this.state.incorrectGuessesObj.find(el => el.id === this.state.currentData.id);
          if (!incorrect) {
            this.updateDifficultyStats('good', false, false);
          }
          setTimeout(() => {
            this.continueGame();
          }, 3000)
        }
      }
    } else {
      this.handleIncorrectAnswer();
    }
  }

  handleSubmit(evt) {
    evt.preventDefault();
  }

  repeatWord = () => {
    this.setState(prevState => ({
      fullData: [...prevState.fullData, this.state.currentData],
      isDifficultyChoice: false,
    }));
    this.continueGame();
  }

  updateWordsLearntPerPage = () => {
    if (this.props.basicGameWords === 'new' || this.props.basicGameWords === 'combined') {
      let { wordsLearntPerPage, wordsPerDay, page, level } = this.state;
      wordsLearntPerPage = wordsLearntPerPage + wordsPerDay;
      if (wordsLearntPerPage > 20) {
        wordsLearntPerPage = wordsLearntPerPage - 20;
        page++;
      } else if (wordsLearntPerPage === 20) {
        wordsLearntPerPage = 0;
        page++;
      }
      if (page > 29 && level < 6) {
        level++;
        page = 0;
      }
      this.setState({
        wordsLearntPerPage,
        page,
        level
      }, this.handleSettingsUpdate)
    } else {
      this.handleSettingsUpdate();
    }
  }

  handleSettingsUpdate = () => {
    let date = new Date();
    let today = date.toLocaleDateString();
    let { wordsPerDay, page, level, wordsLearntPerPage, maxWordsPerDay, hints } = this.state;
    let { meaningHint, translationHint, exampleHint, soundHint, imageHint, transcriptionHint } = hints;
    if (wordsPerDay > 0 && maxWordsPerDay > 0) {
      let newSettings = {
        "wordsPerDay": wordsPerDay,
        "optional": {
          "maxWordsPerDay": maxWordsPerDay,
          "level": level,
          "page": page,
          "wordsLearntPerPage": wordsLearntPerPage,
          "lastTrain": today,
          "hints": {
            "meaningHint": meaningHint,
            "translationHint": translationHint,
            "exampleHint": exampleHint,
            "soundHint": soundHint,
            "imageHint": imageHint,
            "transcriptionHint": transcriptionHint,
          },
        }
      };
      addSettingsUser(newSettings);
    }
  }

  updateDifficultyStats = async (diffLevel, isDeleted, isHard) => {
    let wordId = this.state.currentData.id;
    let word = await getUserWord(wordId);
    let lastTrain = +new Date();
    if (!word) {
      let interval;
      switch (diffLevel) {
        case 'hard':
          interval = hardInterval;
          break;
        case 'good':
          interval = goodInterval;
          break;
        case 'easy':
          interval = easyInterval;
          break;
        default:
          interval = 0;
          break;
      }
      let nextTrain = new Date().setDate(new Date().getDate() + interval);
      let newWord = {
        "difficulty": diffLevel,
        "optional": {
          "deleted": isDeleted,
          "hardWord": isHard,
          "repeatsStreak": 1,
          "repeatsTotal": 1,
          "addingDate": lastTrain,
          lastTrain,
          nextTrain
        }
      }
      createUserWord(wordId, newWord);
    } else {
      let hardWordStatus = (word.optional.hardWord) ? true : isHard;
      if (diffLevel === 'none') {
        diffLevel = word.difficulty;
      }
      let repeatsStreak;
      if (diffLevel === word.difficulty) {
        repeatsStreak = word.optional.repeatsTotal + 1;
      } else {
        repeatsStreak = 1;
      }
      let interval;
      switch (diffLevel) {
        case 'hard':
          interval = repeatsStreak * hardInterval;
          break;
        case 'good':
          interval = repeatsStreak * goodInterval;
          break;
        case 'easy':
          interval = repeatsStreak * easyInterval;
          break;
        default:
          interval = 0;
          break;
      }
      let nextTrain = new Date().setDate(new Date().getDate() + interval);
      let newWord = {
        "difficulty": diffLevel,
        "optional": {
          "deleted": isDeleted,
          "hardWord": hardWordStatus,
          repeatsStreak,
          "repeatsTotal": word.optional.repeatsTotal + 1,
          "addingDate": word.optional.addingDate,
          lastTrain,
          nextTrain
        }
      }
      updateUserWord(wordId, newWord);
    }
  }

  handleDifficultyChoice = (diffLevel, isDeleted, isHard) => {
    this.setState({
      isGuessCheck: false
    })
    this.updateDifficultyStats(diffLevel, isDeleted, isHard);
    this.setState({
      isDifficultyChoice: false,
    })
  }

  chooseWordDifficulty = (diffLevel, isDeleted, isHard) => {
    this.handleDifficultyChoice(diffLevel, isDeleted, isHard);
    this.continueGame();
  }

  addToDictionary = (diffLevel, isDeleted, isHard) => {
    if (!(this.state.isGuessed || this.state.isSkipped)) {
      this.handleDifficultyChoice(diffLevel, isDeleted, isHard);
      this.setState({
        wordsPerGame: this.state.wordsPerGame + 1,
      }, this.continueGame);
    }
  }

  continueGame = () => {
    if (this.state.wordsPerGame !== this.state.fullData.length) {
      this.goToNextCard();
    } else {
      this.setState({
        isStats: true
      })
      this.updateWordsLearntPerPage()
    }
  }

  render() {
    let translationBlock = (this.state.hints.translationHint && this.state.isGuessed)
      ? this.state.currentData.wordTranslate : '';
    let progressValue = Math.round(this.state.wordsPerGame / this.state.fullData.length * 100).toString();
    let correctGuessesPercent = Math.round(this.state.correctGuesses / this.state.fullData.length * 100);
    return (
      <Fade bottom opposite>
        <div className={((this.state.hints.imageHint && this.state.isImageLoaded) || !this.state.hints.imageHint) ? "game-container" : "loading"}>
          {this.state.isStats && (
            <div className="game-end game-end__stat">
              <div>Words completed: {this.state.wordsPerGame}</div>
              <div>Correct answers: {correctGuessesPercent}%</div>
              <div>New words: {Math.min(this.state.wordsPerDay, this.state.maxWordsPerDay)}</div>
              <div>Longest correct answers streak:
                {Math.max(this.state.correctGuessesStreak, this.state.correctGuessesStreakTemp)}</div>
            </div>
          )}
          <header className="basic-game-header">
            <div className="incorrect"></div>
            <div className="checkboxes-container">
              <span>Show buttons: </span>
              <span>
                <label className="label-text">Delete</label>
                <input type="checkbox" name="addToDeleted" className="checkbox-display-btns"
                  checked={this.state.buttons.addToDeleted} onChange={this.handleCheckboxChange} />
              </span>
              <span>
                <label className="label-text">Hard Words</label>
                <input type="checkbox" name="addToHard" className="checkbox-display-btns"
                  checked={this.state.buttons.addToHard} onChange={this.handleCheckboxChange} />
              </span>
              <span>
                <label className="label-text">Answer</label>
                <input type="checkbox" name="showAnswer" className="checkbox-display-btns"
                  checked={this.state.buttons.showAnswer} onChange={this.handleCheckboxChange} />
              </span>
              <span>
                <label className="label-text">Choose Difficulty</label>
                <input type="checkbox" name="chooseDifficulty"
                  className={this.state.isDifficultyChoice ? "checkbox-display-btns opaque" : "checkbox-display-btns"}
                  checked={this.state.buttons.chooseDifficulty} onChange={this.handleCheckboxChange} />
              </span>
            </div>
            <div className="btns-container">
              <button className={this.state.hints.translationHint ? "btn" : "btn opaque"}
                onClick={this.toggleTranslationHint}>Translation</button>
              <button className={this.state.hints.meaningHint ? "btn" : "btn opaque"}
                onClick={this.toggleMeaningHint}>Meaning</button>
              <button className={this.state.hints.exampleHint ? "btn" : "btn opaque"}
                onClick={this.toggleExampleHint}>Example</button>
              <button className={this.state.hints.transcriptionHint ? "btn" : "btn opaque"}
                onClick={this.toggleTranscriptionHint}>Transcription</button>
              <button className={this.state.hints.imageHint ? "btn" : "btn opaque"}
                onClick={this.toggleImageHint}>Image</button>
              <button className={this.state.hints.soundHint ? "btn" : "btn opaque"}
                onClick={this.toggleSoundHint}>Sound</button>
            </div>
          </header>
          <main className="basic-game-main">
            <Card wordData={this.state.currentData} hints={this.state.hints}
              isGuessed={this.state.isGuessed} isSkipped={this.state.isSkipped} isImageLoaded={this.state.isImageLoaded}
              isDifficultyChoice={this.state.isDifficultyChoice} handleImgLoading={this.handleImgLoading} />
            {this.state.isDifficultyChoice ? '' : (
              <div>
                <form onSubmit={this.handleSubmit}>
                  <LettersInput isGuessCheck={this.state.isGuessCheck} word={this.state.currentWord}
                  isGuessed={this.state.isGuessed} isSkipped={this.state.isSkipped} 
                    inputAttempt={this.state.inputAttempt} value={this.state.inputValue}
                    handleInputChange={this.handleInputChange} coloredLetters={this.state.coloredLetters}
                  />
                  <div className="label-text">{translationBlock}</div>
                  <button className="btn btn-further" onClick={this.onClickFurther}>Next</button>
                </form>
              </div>
            )}
            {(this.state.isDifficultyChoice && this.state.buttons.chooseDifficulty) ?
              (<div className="btns-container">
                <button className="btn btn-colored" onClick={this.repeatWord}>Again</button>
                <button className="btn btn-colored" onClick={this.chooseWordDifficulty.bind(this, 'hard', false, false)}>Hard</button>
                <button className="btn btn-colored" onClick={this.chooseWordDifficulty.bind(this, 'good', false, false)}>Good</button>
                <button className="btn btn-colored" onClick={this.chooseWordDifficulty.bind(this, 'easy', false, false)}>Easy</button>
              </div>) : ''}
          </main>
          <footer className="basic-game-footer">
            <div className="progress-container">
              <span>{this.state.wordsPerGame}</span>
              <progress className="progress-current" max="100" value={progressValue}></progress>
              <span>{this.state.fullData.length}</span>
            </div>
            <div className="btns-container">
              {this.state.buttons.showAnswer &&
                <button className={(this.state.isGuessed || this.state.isDifficultyChoice || this.state.isSkipped) ? "btn opaque" : "btn"}
                  onClick={this.onShowAnswer}>Show Answer</button>}
              {this.state.buttons.addToDeleted &&
                <button className={(this.state.isGuessed || this.state.isSkipped) ? "btn opaque" : "btn"}
                  onClick={this.addToDictionary.bind(this, 'none', true, false)}>Delete</button>}
              {this.state.buttons.addToHard &&
                <button className={(this.state.isGuessed || this.state.isSkipped) ? "btn opaque" : "btn"}
                  onClick={this.addToDictionary.bind(this, 'none', false, true)}>Hard Words</button>}
            </div>
          </footer>
        </div>
      </Fade>
    )
  }
}

export default Game1