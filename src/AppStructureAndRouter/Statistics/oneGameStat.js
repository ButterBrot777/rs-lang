import React from 'react';
import GameStatForDate from './dateGameStat';

class GameStat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gameStat: [],
            isLoading: false,
        }
    }

    componentDidMount = () => {
        this.setState({ isLoading: true });
        const gameStatArray = [];
        for (let key in this.props.gameStat) {
            gameStatArray.push({date: key, results: this.props.gameStat[key]});
        }
        this.setState({gameStat: gameStatArray, isLoading: false,});
    }

    

    render() {
        const gameStat = this.state.gameStat;
        return (
            <div className="one-game-stat">
                
                <div className="statistics-game-list">
                    {gameStat.map(oneDateStat => <GameStatForDate date={oneDateStat.date} results={oneDateStat.results} key={oneDateStat.date} />)}
                </div>
            </div>
        )
    }
}

export default GameStat;