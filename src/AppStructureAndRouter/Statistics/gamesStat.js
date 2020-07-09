import React from 'react';
import { getStatisticsUser } from '../ServerRequest/ServerRequests';
import GameStat from './oneGameStat';


class GamesStat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gamesStat: [],
            dateOfReg: '',
            isLoading: false,
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
        this.drawBars();
    }

    drawBars() {
        const canvas = this.refs.canvas
        const ctx = canvas.getContext('2d')
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        const gamesPopularity = this.state.gamesStat.map(game => [game.name, Object.keys(game.stat).length]);
        console.log(gamesPopularity);
        gamesPopularity.forEach((item,index) => {
          ctx.fillStyle = 'rgb(19,40,59)'
          ctx.fillRect(index*120, 280, 100, -item[1]*50)
          ctx.fillStyle = 'rgb(168, 167, 167)'
          ctx.font = "20px sans-serif";
          ctx.fillText(item[0], 5+index*120, 260)
        })
      }

    render() {
        const gamesStat = this.state.gamesStat;
        return (
            <div className="general-stat-container">
                <canvas ref="canvas" width={600} height={300}/>
                <div className="game-stat-list">
                    {gamesStat.map(game => <GameStat gameName={game.name} gameStat={game.stat} key={game.name} />)}
                </div>
            </div>
        )
    }
}

export default GamesStat;