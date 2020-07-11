import React from 'react';
import { getStatisticsUser } from '../ServerRequest/ServerRequests';
import GameStat from './oneGameStat';
import GameStatBtns from './gamesStatBtn';


class GamesStat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gamesStat: [],
            dateOfReg: '',
            isLoading: false,
            game: 'speakIt'
        }
    }

    componentDidMount = async () => {
        this.setState({ isLoading: true });
        const content = await getStatisticsUser();
        const gamesStatArray = [];
        for (let key in content.optional) {
            if (key !== "dateOfReg") {
                gamesStatArray.push({name: key, stat: content.optional[key]});
            }
        }
        console.log(gamesStatArray)
        this.setState({gamesStat: gamesStatArray, isLoading: false,});
        this.drawBars('speakIt');
    }

    drawBars(game) {
        const canvas = this.refs.canvas;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        const gamesPopularity = this.state.gamesStat.map(game => [game.name, Object.keys(game.stat).length]);
        console.log(gamesPopularity);
        const max = Math.max(...gamesPopularity.map(el => el[1]));
        console.log(max);
        const relW = canvas.width /gamesPopularity.length;
        const relH = canvas.height / max;
        console.log(relH);
        gamesPopularity.forEach((item,index) => {
            if (item[0] === game) {
                ctx.fillStyle = 'rgb(19,40,59)';
                ctx.fillRect(index*120, 290, relW-5, -item[1]*relH);
                
            } else {
                ctx.fillStyle = 'rgb(77, 129, 185)'
                ctx.fillRect(index*120, 290, relW-5, -item[1]*relH)
            }
            ctx.font = "14px sans-serif";
            
            if (item[1]%10 === 2 || item[1]%10 === 3 || item[1]%10 === 4) {
                ctx.fillStyle = 'rgb(255,255,255)';
                ctx.fillText(`Cыграно ${item[1]} разa`, index*122, 280);
            } else if (item[1] === 0) {
                ctx.fillStyle = 'rgb(19,40,59)';
                ctx.fillText(`Не играли ни разу`, index*122, 280);
            } else {
                ctx.fillStyle = 'rgb(255,255,255)';
                ctx.fillText(`Cыграно ${item[1]} раз`, index*122, 280);
            }
            
        })
    }

    getSpeakItStat = () => {
        this.setState({game: 'speakIt'});
        this.drawBars('speakIt');
    }
    getPuzzleStat = () => {
        this.setState({game: 'puzzle'});
        this.drawBars('puzzle');
    }
    getSavannahStat = () => {
        this.setState({game: 'savannah'});
        this.drawBars('savannah');
    }
    getSprintStat = () => {
        this.setState({game: 'sprint'});
        this.drawBars('sprint');
    }
    getAudioCallStat = () => {
        this.setState({game: 'audioCall'});
        this.drawBars('audioCall');
    }

    render() {
        const gamesStat = this.state.gamesStat;
        return (
            <div className="general-stat-container">
                <div className="games-stat-canvas-container">
                    <canvas ref="canvas" width={600} height={300}/>
                </div>
                <div className="stat-game-btns-container">
                    <GameStatBtns statOfGame={this.state.game} getSpeakItStat={this.getSpeakItStat} getPuzzleStat={this.getPuzzleStat} getSavannahStat={this.getSavannahStat} getSprintStat={this.getSprintStat} getAudioCallStat={this.getAudioCallStat}/>
                </div>
                <div className="game-stat-list">
                    {gamesStat.map(game => game.name === this.state.game ? <GameStat gameName={game.name} gameStat={game.stat} key={game.name} /> : '')}
                </div>
            </div>
        )
    }
}

export default GamesStat;