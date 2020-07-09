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
        return `${dateObj.getDate()}.${dateObj.getMonth()}.${dateObj.getFullYear()}`;
    }

    componentDidMount = () => {
        const dateString = this.createDateFromTimestamp(+this.props.date);
        this.setState({date: dateString});
    }

    render() {
        const date = this.state.date;
        return (
            <div className="game-statistic-by-date">
                <p className="statistic-date">{date}</p>
                <div className="statistic-date-result">
                <p className="statistic-date-result-errors">Кол-во ошибок: {this.props.results.errors}</p>
                    <p className="statistic-date-result-trues">Кол-во правильных ответов: {this.props.results.trues}</p>
                </div>
            </div>
        )
    }
}

export default GameStatForDate;