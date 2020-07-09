import React from 'react';
import { getAllUserWords, getStatisticsUser } from '../ServerRequest/ServerRequests';

class GeneralStat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            learnedWords: [],
            userStat: {},
            dateOfReg: '',
            learnedWordsCount: 0,
            isLoading: false,
        }
    }

    componentDidMount = async () => {
        this.setState({ isLoading: true });
        const content = await getAllUserWords();
        const learnedWords = content.filter(word => word.optional.deleted===false && word.optional.hardWord===false);
        this.setState({learnedWords: learnedWords, learnedWordsCount: learnedWords.length, isLoading: false,});
        this.getRegisterDate();
    }

    createDateFromTimestamp = (timestamp) => {
        const dateObj = new Date(timestamp); 
        return `${dateObj.getDate()}.${dateObj.getMonth()}.${dateObj.getFullYear()}`;
    }

    getRegisterDate = async () => {
        const content = await getStatisticsUser();
        console.log(content);
        const dateOfReg = this.createDateFromTimestamp(+content.optional.dateOfReg);
        this.setState({userStat: content, dateOfReg: dateOfReg})
    }

    render() {
        return (
            <div className="general-stat-container">
                <div className="general-stat-summary">
                    <p className="general-stat-words-count">Изучено слов: {this.state.learnedWordsCount}</p>
                    <p className="general-stat-date-of-reg">Дата регистрации пользователя: {this.state.dateOfReg}</p>
                </div>
            </div>
        )
    }
}

export default GeneralStat;