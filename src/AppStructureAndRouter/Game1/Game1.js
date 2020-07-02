import React, { Component } from 'react';
import Card from './Card';
import LettersInput from './LettersInput';
import { addSettingsUser, getSettingsUser, getNewWords, getAllUserWords, getUserWord, createUserWord, updateUserWord } from '../ServerRequest/ServerRequests';
import { BrowserRouter as Router, Link } from "react-router-dom";
import Fade from 'react-reveal/Fade';
import './Game1.css'

const userId = localStorage.getItem('userId');
const token = localStorage.getItem('token');
let user = {
  userId,
  token
}
const imageAudioUrl = 'https://raw.githubusercontent.com/22-22/rslang/rslang-data/data/';
const infoTextBtns = 'перевод, пример и значение: как минимум одна из настроек должна быть выбрана.';
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
      isGuessed: false,
      isSkipped: false,
      isDifficultyChoice: false,
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
    this.inputElem = React.createRef();
    this.wordContainerElem = React.createRef();
    this.infoElem = React.createRef();
    this.chooseDifficulty = this.chooseDifficulty.bind(this);
  }

  componentDidMount = async () => {
    let { wordsPerDay, optional: { level, page, wordsLearntPerPage, hints, buttons } } = await getSettingsUser(user);
    if (wordsLearntPerPage === 20) {
      wordsLearntPerPage = 0;
      page++;
    }
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

  findCurrentData = (data, dataIdx) => {
    return data.find((wordData, idx) => idx === dataIdx);
  }

  handleInputChange = (value) => {
    this.setState({
      inputValue: value
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
      this.infoElem.current.textContent = infoTextBtns;
      setTimeout(() => this.infoElem.current.textContent = '', 4000)
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
      this.infoElem.current.textContent = infoTextBtns
      setTimeout(() => this.infoElem.current.textContent = '', 4000)
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
      this.infoElem.current.textContent = infoTextBtns
      setTimeout(() => this.infoElem.current.textContent = '', 4000)
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

  onShowAnswer = () => {
    if (!this.state.isGuessed && !this.state.isDifficultyChoice) {
      this.setState({
        inputValue: ''
      })
      let longestStreak;
      if (this.state.correctGuessesStreak > this.state.correctGuessesStreakTemp) {
        longestStreak = this.state.correctGuessesStreak;
      } else {
        longestStreak = this.state.correctGuessesStreakTemp;
      }
      this.setState({
        isSkipped: true,
        wordsPerGame: this.state.wordsPerGame + 1,
        correctGuessesStreakTemp: longestStreak,
        correctGuessesStreak: 0,
      });
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
      this.checkIfCorrectGuess();
    } else {
      this.infoElem.current.textContent = 'введите слово'
      setTimeout(() => this.infoElem.current.textContent = '', 3000)
    }
  }

  goToNextCard = () => {
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
    let sameWord = this.state.fullData.filter(wordObj => wordObj === this.state.currentData)
    let longestStreak;
    if (this.state.correctGuessesStreak > this.state.correctGuessesStreakTemp) {
      longestStreak = this.state.correctGuessesStreak;
    } else {
      longestStreak = this.state.correctGuessesStreakTemp;
    }
    if (sameWord.length < 2) {
      this.setState(prevState => ({
        fullData: [...prevState.fullData, this.state.currentData],
        correctGuessesStreakTemp: longestStreak,
        correctGuessesStreak: 0,
        incorrectGuesses: this.state.correctGuesses + 1,
      }));
    }
    this.wordContainerElem.current.classList.remove('hidden');
    this.inputElem.current.blur();
    this.inputElem.current.addEventListener('focus', () => {
      this.wordContainerElem.current.classList.add('hidden');
    }, { once: true });
    setTimeout(this.removeLetterColors, 2000)
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
    let { wordsPerDay, page, level, hints, wordsLearntPerPage } = this.state;
    let newSettings = {
      "wordsPerDay": wordsPerDay,
      "optional": {
        "maxWordsPerDay": 30,
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
    addSettingsUser(token, userId, newSettings);
  }

  chooseDifficulty = async (diffLevel, isDeleted, isHard) => {
    if (!this.state.isGuessed || this.state.isSkipped) {
      let word = await getUserWord(this.state.currentData.id, user);
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
          userId: user.userId,
          wordId: this.state.currentData.id,
          word: {
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
        }
        createUserWord(newWord)
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
          userId: user.userId,
          wordId: this.state.currentData.id,
          word: {
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
        }
        updateUserWord(newWord);
      }

      this.setState({
        isDifficultyChoice: false,
      })

      if (isDeleted || isHard) {
        this.setState({
          wordsPerGame: this.state.wordsPerGame + 1,
        });
      }

      this.continueGame();
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

  filterUserWords = async () => {
    const userWords = await getAllUserWords(user);
    // const userWords = await getAggregateUserWords(user);

    const currentDate = new Date();
    const wordsForGame = userWords.filter(word => word.optional.nextTrain <= +currentDate);
    // console.log(`?filter=${encodeURIComponent('{"$and":[{"userWord.optional.deleted":false, "userWord.optional.hardWord":false}]}')}`);
    console.log(wordsForGame)
    return wordsForGame;
  }

  render() {
    let translationBlock = (this.state.hints.translationHint && this.state.isGuessed)
      ? this.state.currentData.wordTranslate : '';
    let progressValue = Math.round(this.state.wordsPerGame / this.state.fullData.length * 100);
    let correctGuessesPercent = Math.round(this.state.correctGuesses / this.state.fullData.length * 100);
    return (
      <Fade bottom opposite>
        <div className="game-container">
          {(this.state.wordsPerGame === this.state.fullData.length && !this.state.isDifficultyChoice) ? (
            <div className="game-end">
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
            <div className="incorrect" ref={this.infoElem}></div>
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
              <button onClick={this.filterUserWords}>Test</button>
            </div>
          </header>
          <main className="basic-game-main">
            <Card wordData={this.state.currentData} hints={this.state.hints}
              isGuessed={this.state.isGuessed} isSkipped={this.state.isSkipped}
              isDifficultyChoice={this.state.isDifficultyChoice} />
            {this.state.isDifficultyChoice ? '' : (
              <div>
                <form onSubmit={this.handleSubmit}>
                  <LettersInput
                    isSkipped={this.state.isSkipped} isGuessed={this.state.isGuessed}
                    inputRef={this.inputElem} wordContainerRef={this.wordContainerElem} value={this.state.inputValue}
                    word={this.state.currentWord} handleInputChange={this.handleInputChange}
                  />
                  <div>{translationBlock}</div>
                  <button className="btn btn-further" onClick={this.onClickFurther}>Дальше</button>
                </form>

              </div>
            )}
            {(this.state.isDifficultyChoice && this.state.buttons.chooseDifficulty) ?
              (<div className="btns-container">
                <button className="btn btn-colored" onClick={this.repeatWord}>Снова</button>
                <button className="btn btn-colored" onClick={this.chooseDifficulty.bind(this, 'hard', false, false)}>Трудно</button>
                <button className="btn btn-colored" onClick={this.chooseDifficulty.bind(this, 'good', false, false)}>Хорошо</button>
                <button className="btn btn-colored" onClick={this.chooseDifficulty.bind(this, 'easy', false, false)}>Легко</button>
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
                <button className={(this.state.isGuessed || this.state.isDifficultyChoice) ? "btn opaque" : "btn"} onClick={this.onShowAnswer}>Показать ответ</button>}
              {this.state.buttons.addToDeleted &&
                <button className={(this.state.isGuessed || this.state.isSkipped) ? "btn opaque" : "btn"} onClick={this.chooseDifficulty.bind(this, 'none', true, false)}>Удалить</button>}
              {this.state.buttons.addToHard &&
                <button className={(this.state.isGuessed || this.state.isSkipped) ? "btn opaque" : "btn"} onClick={this.chooseDifficulty.bind(this, 'none', false, true)}>Сложные</button>}
            </div>

          </footer>

        </div>
      </Fade>
    )
  }
}

export default Game1