import React, { Component } from 'react';
import { BrowserRouter as Router, Link } from "react-router-dom";
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
import './Statistic.css'
const easyInterval = 3;
const goodInterval = 2;
const hardInterval = 1;
class Statistic extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
        this.handleCardClick = this.handleCardClick.bind(this);
        this.sendStatistic = this.sendStatistic.bind(this);
        this.sendPageAndLevel = this.sendPageAndLevel.bind(this);
    }

    componentWillMount() {
        if (!this.props.totalGame) {
            this.sendStatistic();
            let diffLevel;
            let wordId;

            this.props.true.forEach(element => {
                diffLevel = "good";
                wordId = element.id;
                this.handleUserWordUpdate(diffLevel, wordId);
            });

            this.props.false.forEach(element => {
                diffLevel = "hard";
                wordId = element.id;
                this.handleUserWordUpdate(diffLevel, wordId);
            });
            this.sendPageAndLevel();
        }
    }

    sendPageAndLevel = async () => {
        let oldSettings = await getSettingsUser();
        let page = this.props.newPage;
        let level = this.props.newLevel;
        let wordsLearntPerPage = 0;
        let newSettings = { ...oldSettings, optional: { ...oldSettings.optional, page, level, wordsLearntPerPage } }
        delete newSettings.id;
        addSettingsUser(newSettings);
    }

    sendStatistic() {
        getStatisticsUser().then(data => {
            data.optional[this.props.nameGame][`${+new Date()}`] = {
                "errors": this.props.false.length,
                "trues": this.props.true.length
            };
            delete data.id
            let stat = data;
            updateStatisticsUser(stat);
        }
        )
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
            let newWord = {
                "difficulty": word.difficulty,
                "optional": {
                    "deleted": word.optional.deleted,
                    "hardWord": word.optional.hardWord,
                    "repeatsStreak": word.optional.repeatsStreak + 1,
                    "repeatsTotal": word.optional.repeatsTotal + 1,
                    "addingDate": word.optional.addingDate,
                    lastTrain,
                    nextTrain
                }
            }
            updateUserWord(wordId, newWord);
        }
    }

    render() {
        return (
            <div className="results">
                <div className="results-container">
                    <p className="errors">Ошибок
            <span className="errors-number">{this.props.false.length}</span>
                    </p>
                    <div className="error-items">
                        {this.props.false.map(wordObj =>
                            <Card wordObj={wordObj}
                                key={wordObj.id}
                                onCardClick={this.handleCardClick} />
                        )}
                    </div>
                    <p className="success">Знаю
              <span className="success-number">{this.props.true.length}</span>
                    </p>
                    <div className="success-items">
                        {this.props.true.map(wordObj =>
                            <Card wordObj={wordObj}
                                key={wordObj.id}
                                onCardClick={this.handleCardClick} />
                        )}
                    </div>
                    <div className="results__btns">
                        <Link to='/HomePage'><button>HomePage</button></Link>
                        <button onClick={this.props.homePageGame}>New adasdGame</button>
                    </div>
                </div>
            </div>
        )
    }
}
class Card extends React.Component {
    render() {
        const { id, audio, transcription, word, wordTranslate } = this.props.wordObj;
        // const card = "card";
        const card1 = "results__card"
        // const card2 = "card-active"
        return (
            <div data-id={id} className={card1}>
                {/* <img onClick={() => this.props.playSound(audio)} className="card__icon" alt="soundIcon"></img> */}
                <span className="bold results__text">{word}</span>
                <span className="results__text">{transcription}</span>
                <span className="results__text">{wordTranslate}</span>
            </div>
        )
    }
}

export default Statistic
