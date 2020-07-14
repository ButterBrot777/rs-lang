import React from 'react';
import { createDateFromTimestamp } from './dateConverter';

class GameStatForDate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: '',
            isLoading: false,
        }
    }

    componentDidMount = () => {
        const dateString = createDateFromTimestamp(+this.props.date);
        this.setState({date: dateString});
    }

    render() {
        const date = this.state.date;
        return (
            <div className="game-stat-by-date">
                <p className="stat-game-date">{date}</p>
                <div className="stat-game-date-result">
                    <p className="stat-date-result-errors">Mistakes: {this.props.results.errors}</p>
                    <p className="stat-date-result-trues">Correct answers: {this.props.results.trues}</p>
                </div>
            </div>
        )
    }
}

export default GameStatForDate;
