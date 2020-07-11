import React from 'react';

class GameStatBtns extends React.Component {

    render() {
        return (
            <div className="games-stat-buttons">
                <button className={this.props.statOfGame === "speakIt" ? "stat-btn stat-game-btn stat-speakIt-btn active" : "stat-btn stat-speakIt-btn stat-game-btn"} onClick={this.props.getSpeakItStat}>Speak It</button>
                <button className={this.props.statOfGame === "puzzle" ? "stat-btn stat-game-btn active" : "stat-btn stat-game-btn"} onClick={this.props.getPuzzleStat}>Puzzle</button>
                <button className={this.props.statOfGame === "savannah" ? "stat-btn stat-game-btn active" : "stat-btn stat-game-btn"} onClick={this.props.getSavannahStat}>Savannah</button>
                <button className={this.props.statOfGame === "sprint" ? "stat-btn stat-game-btn active" : "stat-btn stat-game-btn"} onClick={this.props.getSprintStat}>Sprint</button>
                <button className={this.props.statOfGame === "audioCall" ? "stat-btn stat-game-btn active" : "stat-btn stat-game-btn"} onClick={this.props.getAudioCallStat}>Audio Call</button>
            </div>
        )
    }

}

export default GameStatBtns;
