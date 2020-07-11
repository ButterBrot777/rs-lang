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
        this.drawBars('speakIt', "canvas-desk");
        this.drawBars('speakIt', "canvas-mob");

    }

    drawBars(game, canva) {
        const canvas = this.refs[canva];
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
                ctx.fillRect(index*canvas.width/5, canvas.height-10, relW-5, -item[1]*relH);
                
            } else {
                ctx.fillStyle = 'rgb(77, 129, 185)'
                ctx.fillRect(index*canvas.width/5, canvas.height-10, relW-5, -item[1]*relH)
            }
            if (canva === 'canvas-desk'){
                ctx.font = "14px sans-serif";
                if (item[1]%10 === 2 || item[1]%10 === 3 || item[1]%10 === 4) {
                    ctx.fillStyle = 'rgb(255,255,255)';
                    ctx.fillText(`Cыграно ${item[1]} разa`, index*(canvas.width/5+2), canvas.height-20);
                } else if (item[1] === 0) {
                    ctx.fillStyle = 'rgb(19,40,59)';
                    ctx.fillText(`Не играли ни разу`, index*(canvas.width/5+2), canvas.height-20);
                } else {
                    ctx.fillStyle = 'rgb(255,255,255)';
                    ctx.fillText(`Cыграно ${item[1]} раз`, index*(canvas.width/5+2), canvas.height-20);
                }
            }
            
        })
    }

    getSpeakItStat = () => {
        this.setState({game: 'speakIt'});
        this.drawBars('speakIt', "canvas-desk");
        this.drawBars('speakIt', "canvas-mob");
    }
    getPuzzleStat = () => {
        this.setState({game: 'puzzle'});
        this.drawBars('puzzle', "canvas-desk");
        this.drawBars('puzzle', "canvas-mob");
    }
    getSavannahStat = () => {
        this.setState({game: 'savannah'});
        this.drawBars('savannah', "canvas-desk");
        this.drawBars('savannah', "canvas-mob");
    }
    getSprintStat = () => {
        this.setState({game: 'sprint'});
        this.drawBars('sprint', "canvas-desk");
        this.drawBars('sprint', "canvas-mob");
    }
    getAudioCallStat = () => {
        this.setState({game: 'audioCall'});
        this.drawBars('audioCall', "canvas-desk");
        this.drawBars('audioCall', "canvas-mob");
    }

    render() {
        const gamesStat = this.state.gamesStat;
        return (
            <div className="general-stat-container">
                <div className="games-stat-canvas-desk-container">
                    <canvas ref="canvas-desk" width={600} height={300}/>
                </div>
                <div className="games-stat-canvas-mob-container">
                    <canvas ref="canvas-mob" width={300} height={300}/>
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