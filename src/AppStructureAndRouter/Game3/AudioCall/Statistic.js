import React from "react";
import { BrowserRouter as Router, Link } from 'react-router-dom';

export default class Statistic extends React.Component {

    componentDidMount() {
        document.removeEventListener('keydown',this.props.needToRemove  );
        this.sendStatistic()
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
        console.log('статистика',content)
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
        console.log('ответ',content)
        return content;
    };

    render() {
        return (
            <div>
                <Link to="/">
                  <div>Закрыть</div>
                </Link>
                <div>
                    <p>Правильные {this.props.statistic.RightWords.length}</p>
                    {this.props.statistic.RightWords.map((e,i) => <StatisticString word = {e} key = {i}/>) }
                </div>
                <div >
                    <p>Неправильые {this.props.statistic.FalseWords.length}</p>
                    {this.props.statistic.FalseWords.map((e,i) => <StatisticString word = {e} key = {i}/>) }
                </div>
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
            <div className='Statistic__word' onClick={() => this.playSound()}>
                <div className={'sound__small'} />
                <p>{this.props.word.word}</p>
                <p>{this.props.word.wordTranslate}</p>
            </div>
        )
    }
}

