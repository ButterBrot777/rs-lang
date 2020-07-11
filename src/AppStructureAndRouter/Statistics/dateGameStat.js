import React from 'react';

class GameStatForDate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: '',
            isLoading: false,
        }
    }

    createDateFromTimestamp = (timestamp) => {
        const dateObj = new Date(timestamp); 
        return `${dateObj.getDate() < 10 ? '0' + dateObj.getDate() : dateObj.getDate()}.${dateObj.getMonth()+1 < 10 ? '0' + (dateObj.getMonth()+1) : dateObj.getMonth()+1}.${dateObj.getFullYear()}`;
    }

    componentDidMount = () => {
        const dateString = this.createDateFromTimestamp(+this.props.date);
        this.setState({date: dateString});
    }

    render() {
        const date = this.state.date;
        return (
            <div className="game-stat-by-date">
                <p className="stat-game-date">{date}</p>
                <div className="stat-game-date-result">
                    <p className="stat-date-result-errors">Кол-во ошибок: {this.props.results.errors}</p>
                    <p className="stat-date-result-trues">Кол-во правильных ответов: {this.props.results.trues}</p>
                </div>
            </div>
        )
    }
}

export default GameStatForDate;