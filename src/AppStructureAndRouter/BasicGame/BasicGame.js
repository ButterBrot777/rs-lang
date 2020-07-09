import React, { Component } from 'react';
import Card from './Card';
import LettersInput from './LettersInput';
import {
  getRefreshToken, addSettingsUser, getSettingsUser, getNewWords,
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
      isImageLoaded: false,
      coloredLetters: false,
      maxWordsPerDay: 0,
      wordsPerDay: 0,
      level: 0,
      page: 0,
      wordsLearntPerPage: 0,
      wordsPerGame: 0,
      correctGuesses: 0,
      incorrectGuesses: 0,
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
        console.log('hardWordsTraining')
      } else {
        if (basicGameWords === 'new') {
          this.startGameWithNewWords()
            .then(() => this.addCurrentDataToState());
        } else if (basicGameWords === 'learned') {
          this.startGameWithLearntWords(this.state.maxWordsPerDay)
            .then(() => this.addCurrentDataToState());
        } else {
          let wordLimit = this.state.maxWordsPerDay - this.state.wordsPerDay;
          this.startGameWithNewWords();
          this.startGameWithLearntWords(wordLimit)
            .then(() => this.addCurrentDataToState());
        }
      }
    })
  }

  addSettingsToState = async () => {
    let { wordsPerDay, optional: { maxWordsPerDay, level, page, wordsLearntPerPage, hints } }
      = await getSettingsUser();
    if (wordsLearntPerPage === 20) {
      wordsLearntPerPage = 0;
      page++;
    }
    if (page > 29 && level < 6) {
      level++;
      page = 0;
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
    let { page, level, wordsLearntPerPage, wordsPerDay } = this.state;
    let fullDataPerPage = await getNewWords(page, level);
    let fullData = fullDataPerPage.filter((data, idx) => {
      if (idx >= wordsLearntPerPage && (idx < (wordsLearntPerPage + wordsPerDay))) {
        return data;
      }
    })
    if (fullData.length < wordsPerDay) {
      let wordsNeeded = wordsPerDay - fullData.length;
      if (page >= 29 && level < 6) {
        level++;
        page = 0;
      } else {
        page++;
      }
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

  startGameWithLearntWords = async (maxWordsPerDay) => {
    const userWords = await getAllUserWords();
    const wordsForGame = this.filterUserWords(maxWordsPerDay, userWords);
    const promises = wordsForGame.map(async (word) => await getWordById(word.wordId))
    const fullData = await Promise.all(promises);
    this.setState({
      fullData: this.state.fullData.concat(fullData)
    })
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
    userWords.filter(word => {
      let { deleted, hardWord, nextTrain } = word.optional;
      if (!deleted && !hardWord && nextTrain <= +currentDate && wordsForGame.length < wordsLimit) {
        wordsForGame.push(word);
      }
    });
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
    this.setState({
      buttons: {
        ...this.state.buttons,
        [name]: value
      }
    });
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
    if (!this.state.isGuessed && !this.state.isDifficultyChoice) {
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
        incorrectGuesses: this.state.correctGuesses + 1,
      }));
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
          this.updateDifficultyStats('good', false, false);
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
    let { wordsLearntPerPage, wordsPerDay } = this.state;
    wordsLearntPerPage = wordsLearntPerPage + wordsPerDay;
    if (wordsLearntPerPage > 20) {
      wordsLearntPerPage = wordsLearntPerPage - 20;
    }
    this.setState({
      wordsLearntPerPage
    })
  }

  handleSettingsUpdate = () => {
    let { wordsPerDay, page, level, wordsLearntPerPage, maxWordsPerDay, hints } = this.state;
    if (wordsPerDay > 0 && maxWordsPerDay > 0) {
      let newSettings = {
        "wordsPerDay": wordsPerDay,
        "optional": {
          "maxWordsPerDay": maxWordsPerDay,
          "level": level,
          "page": page,
          "wordsLearntPerPage": wordsLearntPerPage,
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
          "hardWord": isHard,
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
      this.updateWordsLearntPerPage();
      this.handleSettingsUpdate();
    }
  }

  handleRefresh = async () => {
    await getRefreshToken();
  }

  render() {
    console.log(this.props)
    let translationBlock = (this.state.hints.translationHint && this.state.isGuessed)
      ? this.state.currentData.wordTranslate : '';
    let progressValue = Math.round(this.state.wordsPerGame / this.state.fullData.length * 100);
    let correctGuessesPercent = Math.round(this.state.correctGuesses / this.state.fullData.length * 100);
    return (
      <Fade bottom opposite>
        <div className="game-container">
          {(this.state.wordsPerGame === this.state.fullData.length && !this.state.isDifficultyChoice) ? (
            <div className="game-end">
              <button onClick={this.handleRefresh}>Test</button>
              <h1 className="info-big">Ура, на сегодня все!</h1>
              <div className="info-small">Есть еще новые карточки, но дневной лимит исчерпан.</div>
              <div>Карточек завершено: {this.state.wordsPerGame}</div>
              <div>Правильные ответы: {correctGuessesPercent}%</div>
              <div>Новые слова: {this.state.wordsPerDay}</div>
              <div> Самая длинная серия правильных ответов:
                {Math.max(this.state.correctGuessesStreak, this.state.correctGuessesStreakTemp)}</div>
            </div>
          ) : ''}
          <header className="basic-game-header">
            <div className="incorrect"></div>
            <div className="checkboxes-container">
              <span>Показать кнопку: </span>
              <span>
                <label>Удалить</label>
                <input type="checkbox" name="addToDeleted" className="checkbox-display-btns"
                  checked={this.state.buttons.addToDeleted} onChange={this.handleCheckboxChange} />
              </span>
              <span>
                <label>Сложные</label>
                <input type="checkbox" name="addToHard" className="checkbox-display-btns"
                  checked={this.state.buttons.addToHard} onChange={this.handleCheckboxChange} />
              </span>
              <span>
                <label>Ответ</label>
                <input type="checkbox" name="showAnswer" className="checkbox-display-btns"
                  checked={this.state.buttons.showAnswer} onChange={this.handleCheckboxChange} />
              </span>
              <span>
                <label>Выбор сложности</label>
                <input type="checkbox" name="chooseDifficulty" className="checkbox-display-btns"
                  checked={this.state.buttons.chooseDifficulty} onChange={this.handleCheckboxChange} />
              </span>
            </div>
            <div className="btns-container">
              <button className={this.state.hints.translationHint ? "btn" : "btn opaque"}
                onClick={this.toggleTranslationHint}>перевод</button>
              <button className={this.state.hints.meaningHint ? "btn" : "btn opaque"}
                onClick={this.toggleMeaningHint}>значение</button>
              <button className={this.state.hints.exampleHint ? "btn" : "btn opaque"}
                onClick={this.toggleExampleHint}>пример</button>
              <button className={this.state.hints.transcriptionHint ? "btn" : "btn opaque"}
                onClick={this.toggleTranscriptionHint}>транскрипция</button>
              <button className={this.state.hints.imageHint ? "btn" : "btn opaque"}
                onClick={this.toggleImageHint}>картинка</button>
              <button className={this.state.hints.soundHint ? "btn" : "btn opaque"}
                onClick={this.toggleSoundHint}>звук</button>
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
                    inputAttempt={this.state.inputAttempt} value={this.state.inputValue}
                    handleInputChange={this.handleInputChange} coloredLetters={this.state.coloredLetters}
                  />
                  <div>{translationBlock}</div>
                  <button className="btn btn-further" onClick={this.onClickFurther}>Дальше</button>
                </form>
              </div>
            )}
            {(this.state.isDifficultyChoice && this.state.buttons.chooseDifficulty) ?
              (<div className="btns-container">
                <button className="btn btn-colored" onClick={this.repeatWord}>Снова</button>
                <button className="btn btn-colored" onClick={this.chooseWordDifficulty.bind(this, 'hard', false, false)}>Трудно</button>
                <button className="btn btn-colored" onClick={this.chooseWordDifficulty.bind(this, 'good', false, false)}>Хорошо</button>
                <button className="btn btn-colored" onClick={this.chooseWordDifficulty.bind(this, 'easy', false, false)}>Легко</button>
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
                <button className={(this.state.isGuessed || this.state.isDifficultyChoice) ? "btn opaque" : "btn"}
                  onClick={this.onShowAnswer}>Показать ответ</button>}
              {this.state.buttons.addToDeleted &&
                <button className={(this.state.isGuessed || this.state.isSkipped) ? "btn opaque" : "btn"}
                  onClick={this.addToDictionary.bind(this, 'none', true, false)}>Удалить</button>}
              {this.state.buttons.addToHard &&
                <button className={(this.state.isGuessed || this.state.isSkipped) ? "btn opaque" : "btn"}
                  onClick={this.addToDictionary.bind(this, 'none', false, true)}>Сложные</button>}
            </div>
          </footer>
        </div>
      </Fade>
    )
  }
}

export default Game1