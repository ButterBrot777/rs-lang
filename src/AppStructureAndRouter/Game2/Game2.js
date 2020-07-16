import React, {
  Component
} from 'react';
import {
  BrowserRouter as Router,
  Link
} from "react-router-dom";
import Fade from 'react-reveal/Fade';

import video from './images/background-video6.mp4'
import HomePage from './HomePage'
import LoadingWindow from '../LoadingWindow/LoadingWindow'
import './Game2.css'
import './Game2media.css'
import RenderWords from './Words';
import {
  loginUser,
  signInRequest,
  signUpRequest,
  startSettingsUser,
  addSettingsUser,
  getSettingsUser,
  updateStatisticsUser,
  getStatisticsUser,
  getNewWords,
  getUserWord,
  getAllUserWords,
  createUserWord,
  updateUserWord,
  getWordById
} from '../ServerRequest/ServerRequests';
class Game2 extends Component {
  constructor() {
    super()
    this.state = {
      startGame: false,
      loading: false,
      data: [],
      chooseGame: false,
    };
    this.handleLoading = this.handleLoading.bind(this);
    this.requestWords = this.requestWords.bind(this);
    this.chooseLevel = this.chooseLevel.bind(this);
    this.defaultLevel = this.defaultLevel.bind(this);
  }
  mainPage = 0;
  mainLevel = 0;

  defaultLevel() {
    this.setState({
      startGame: false,
      loading: false,
      data: [],
      chooseGame: false
    })
  }

  writeData = async () => {
    const userWords = await getAllUserWords();
    const currentDate = new Date();
    const wordsForGame = userWords.filter(word => word.optional.deleted === false && word.optional.hardWord === false &&
      word.optional.nextTrain <= +currentDate);
    wordsForGame.splice(50, wordsForGame.length);
    return wordsForGame;
  };

  getIdWords(data) {
    if (data === undefined) return data;
    else {
      return Promise.all(
        data.map((word) => getWordById(word.wordId))
      )
    }
  }

  requestWords() {
    this.writeData()
      .then((data) => this.getIdWords(data))
      .then((wordInfo) => this.newDataWords(wordInfo))
      .then((allWordsInfo) => this.setState({
        data: allWordsInfo,
        loading: false,
        startGame: true,
      }));
  }
  // ==========================================================
  async newDataWords(allWordsInfo) {
    let pagecounter = 1;
    let levelcounter = 0;
    while (allWordsInfo === undefined || allWordsInfo.length < 50) {
      await this.createNewWords(allWordsInfo, pagecounter, levelcounter)
        .then((newWords) => allWordsInfo = newWords);
      pagecounter++;
    }
    allWordsInfo.splice(50, allWordsInfo.length);
    return allWordsInfo;
  }
  createNewWords(allWordsInfo, pagecounter, levelcounter) {
    return getSettingsUser()
      .then((sitings) => this.getNewPageAndLevel(sitings, pagecounter, levelcounter))
      .then((newWordsInfo) => this.margeAllWords(newWordsInfo, allWordsInfo));
  }
  getNewPageAndLevel(sitingsPages, pagecounter, levelcounter) {
    if (sitingsPages.optional.page + pagecounter > 29) {
      pagecounter = 0;
      levelcounter += 1;
      if (sitingsPages.optional.level + levelcounter > 5) {
        this.mainLevel = 0;
      }
      this.mainPage = sitingsPages.optional.page + pagecounter;
    } else {
      this.mainPage = sitingsPages.optional.page + pagecounter;
      this.mainLevel = sitingsPages.optional.level + levelcounter;
    }
    let newWords = getNewWords(this.mainPage, this.mainLevel);
    return newWords;
  }
  margeAllWords(newWordsInfo, allWordsInfo) {
    newWordsInfo = newWordsInfo.filter(word => allWordsInfo.map((e) => Object.values(e)[0]).indexOf(Object.values(word)[0]) === -1);
    newWordsInfo.forEach(element => {
      allWordsInfo = [...allWordsInfo, element]
    });
    return allWordsInfo;
  }
  handleLoading() {
    this.mainPage = 1;
    this.mainLevel = 0;
    this.setState({ loading: true });
    this.requestWords();
  }

  chooseLevel(page, level) {
    this.setState({
      loading: true
    })
    let masData = [];
    this.getDataToChooseLevel(masData, page, level);

  }
  getDataToChooseLevel(masData, page, level) {
    this.newDataChooseWords(masData, +page, +level)
      .then((allWordsInfo) => this.setState({
        data: allWordsInfo,
        startGame: true,
        loading: false,
        chooseGame: true
      }));
  }
  async newDataChooseWords(masData, page, level) {

    while (masData === undefined || masData.length < 40) {
      if (page > 29) {
        page = 0;
        level += 1;
        if (level > 5) {
          level = 0;
        }
      }
      await this.createNewChooseWords(masData, page, level)
        .then((newWords) => masData = newWords);
      page++;
    }
    return masData;
  }
  createNewChooseWords(allWordsInfo, page, level) {
    return getNewWords(page, level)
      .then((newWordsInfo) => this.margeAllWords(newWordsInfo, allWordsInfo));
  }
  render() {
    if (this.state.startGame) {
      return (
        <div id="video-bg">
          <video id="background-video" loop autoPlay>
            <source src={video} type='video/mp4' />
          </video>
          <RenderWords defaultLevel={this.defaultLevel} dataWords={this.state.data}
            pageSprint={this.mainPage} levelSprint={this.mainLevel} chooseGame={this.state.chooseGame} />
        </div>
      )
    } else if (this.state.loading) {
      return (
        <LoadingWindow background={"#fbc97e"} />
      )
    } else {
      return (
        <div id="video-bg" >
          <video id="background-video" loop autoPlay>
            <source src={video} type='video/mp4' />
          </video>
          <HomePage handleLoading={this.handleLoading} chooseLevel={this.chooseLevel} />
        </div>
      )
    }
  }
}
export default Game2