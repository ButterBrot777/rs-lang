import React from "react";
import { BrowserRouter as Router, Link } from 'react-router-dom';
import {createUserWord, getUserWord, updateUserWord,getAllUserWords} from "../../ServerRequest/ServerRequests";

export default class Statistic extends React.Component {

     easyInterval = 3;
     goodInterval = 2;
     hardInterval = 1;

    componentDidMount() {

        document.removeEventListener('keydown',this.props.needToRemove  );
        this.props.statistic.RightWords.map((e) => this.handleUserWordUpdate("good", e.id));
        this.props.statistic.FalseWords.map((e) => this.handleUserWordUpdate("hard", e.id));

        this.sendStatistic()
    }

     handleUserWordUpdate = async (diffLevel, wordId) =>{

        let word = await getUserWord(wordId);
        let lastTrain = +new Date();
        if (!word) {
            let interval = (diffLevel === 'good') ? this.goodInterval : this.hardInterval;
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
                    interval = word.optional.repeatsStreak * this.hardInterval;
                    break;
                case 'good':
                    interval = word.optional.repeatsStreak * this.goodInterval;
                    break;
                case 'easy':
                    interval = word.optional.repeatsStreak * this.easyInterval;
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

    userId = localStorage.getItem('userId');
    token = localStorage.getItem('token');
    baseUrl = 'https://afternoon-falls-25894.herokuapp.com';
     sendStatistic = ()  =>{
        this.getStatisticsUser().then( data =>{
                data.optional["audioCall"][`${+new Date()}`] = {
                    "errors": this.props.statistic.FalseWords.length, // кол-во ошибок
                    "trues": this.props.statistic.RightWords.length // кол-во правильных ответов
                };
                delete data.id
                let stat = data;
                this.updateStatisticsUser(stat)
            }
        )
    }

     getStatisticsUser = async () => {
        const rawResponse = await fetch(`${this.baseUrl}/users/${this.userId}/statistics`, {
            method: 'GET',
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Accept': 'application/json',
            },
        });
        const content = await rawResponse.json();

        return content;
    };

    updateStatisticsUser = async (statisticsData) => {
        const rawResponse = await fetch(`${this.baseUrl}/users/${this.userId}/statistics`, {
            method: 'PUT',
            withCredentials: true,
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(statisticsData)
        });
        const content = await rawResponse.json();

        return content;
    };

    render() {
        return (
            <div>
                <div className={'statistic__container'}>
                    <div>
                        <p className={'statistic__header'}>I know {this.props.statistic.RightWords.length}</p>
                        {this.props.statistic.RightWords.map((e,i) => <StatisticString word = {e} key = {i}/>) }
                    </div>
                    <div >
                        <p className={'statistic__header'}>I dont know {this.props.statistic.FalseWords.length}</p>
                        {this.props.statistic.FalseWords.map((e,i) => <StatisticString word = {e} key = {i}/>) }
                    </div>
                </div>
                <button className={'button button_colored margin__button'} onClick={() => this.props.newGame() }>New round</button>
            </div>

        )
    }
}

class StatisticString extends React.Component {
    playSound = () => {
        let sound = new Audio(`https://raw.githubusercontent.com/22-22/rslang/rslang-data/data/${this.props.word.audio}`);
        sound.play()
    };
    render() {
        return (
            <div className='statistic__word' onClick={() => this.playSound()}>
                <button className={'button button_bordered'}>Sound</button>
                <p className={'statistic__string'}>{this.props.word.word}</p>
                <p className={'statistic__string'}>{this.props.word.wordTranslate}</p>
            </div>
        )
    }
}

