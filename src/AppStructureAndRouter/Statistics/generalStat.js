import React from 'react';

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
        const userWordsUrl = `https://afternoon-falls-25894.herokuapp.com/users/${this.props.userId}/words`;
        const rawResponse = await fetch(userWordsUrl, {
            method: 'GET',
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${this.props.token}`,
                'Accept': 'application/json',
            }
        });
        const content = await rawResponse.json();
        const learnedWords = content.filter(word => word.optional.deleted===false && word.optional.hardWord===false);
        this.setState({learnedWords: learnedWords, learnedWordsCount: learnedWords.length, isLoading: false,});
    }

    getRegisterDate = async () => {
        const userStatUrl = `https://afternoon-falls-25894.herokuapp.com/users/${this.props.userId}/statistics`;
        const rawResponse = await fetch(userStatUrl, {
            method: 'GET',
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${this.props.token}`,
                'Accept': 'application/json',
            }
        });
        const content = await rawResponse.json();
        const dateOfReg = new Date(content.optional.dateOfReg);
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