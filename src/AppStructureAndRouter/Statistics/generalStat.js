import React from 'react';
import { getAllUserWords, getStatisticsUser } from '../ServerRequest/ServerRequests';
const msPerDay = 86400000;

class GeneralStat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            learnedWords: [],
            userStat: {},
            dateOfReg: '',
            tooltipPos: {},
            tooltipText: {},
            learnedWordsCount: 0,
            isLoading: false,
        }
    }

    componentDidMount = async () => {
        this.setState({ isLoading: true });
        const content = await getAllUserWords();
        const learnedWords = content.filter(word => word.optional.deleted===false && word.optional.hardWord===false);
        this.setState({learnedWords: learnedWords, learnedWordsCount: learnedWords.length, isLoading: false,});
        console.log(learnedWords);
        this.getRegisterDate();
        
    }

    createDateFromTimestamp = (timestamp) => {
        const dateObj = new Date(timestamp); 
        return `${dateObj.getDate() < 10 ? '0' + dateObj.getDate() : dateObj.getDate()}.${dateObj.getMonth()+1 < 10 ? '0' + (dateObj.getMonth()+1) : dateObj.getMonth()+1}.${dateObj.getFullYear()}`;
    }

    getRegisterDate = async () => {
        const content = await getStatisticsUser();
        console.log(content);
        const dateOfReg = this.createDateFromTimestamp(+content.optional.dateOfReg);
        this.setState({userStat: content, dateOfReg: dateOfReg})
        const wordsPerDay = this.getWordsLearntPerDate();
        this.drawChart(wordsPerDay);
    }

    getWordsLearntPerDate = () => {
        const todayRelDay = Math.floor(new Date().getTime() / msPerDay);
        const relDayOfReg = Math.floor(this.state.userStat.optional.dateOfReg / msPerDay);
        const arrDaysWithWords = [];
        let allWordsCount = 0;
        for (let i = relDayOfReg; i <= todayRelDay; i++) {
            const dateString = this.createDateFromTimestamp(i * msPerDay);
            const arrDateWithWords = [dateString];
            let oneDayWordCount = 0;
            this.state.learnedWords.forEach(word => {
                const relAddingDate = Math.floor(word.optional.addingDate / msPerDay);
                if (relAddingDate === i) {
                    oneDayWordCount = oneDayWordCount + 1;
                }
                return oneDayWordCount;
            })
            arrDateWithWords.push(oneDayWordCount);
            allWordsCount = allWordsCount + oneDayWordCount;
            arrDateWithWords.push(allWordsCount);
            arrDaysWithWords.push(arrDateWithWords);
        }
        console.log(arrDaysWithWords);
        return arrDaysWithWords;
    }

    drawChart = (wordsPerDay) => {
        const canvas = this.refs.canvas;
        const ctx = canvas.getContext('2d');
        
        const maxFromData = Math.max(...wordsPerDay.map(el => el[2]));
        const max = maxFromData % 10 ? (maxFromData + 10 - maxFromData%10) : maxFromData;
        const relW = (canvas.width-50) / wordsPerDay.length;
        const relH = canvas.height / max;
        console.log(relH);
        this.drawGrid(ctx, canvas.height, canvas.width, max);
        this.drawChartAxis(ctx, canvas.height, max);
        
        ctx.beginPath();
        ctx.moveTo(50, canvas.height-wordsPerDay[0][2]*relH-5);
        wordsPerDay.forEach((item,index) => {
            ctx.lineWidth = 3;
            ctx.strokeStyle = 'rgb(19,40,59)';
            ctx.lineTo(50+index*relW, canvas.height-item[2]*relH-5);
        })
        ctx.stroke();

        const d = 4;
        ctx.fillStyle='rgb(19,40,59)';
        wordsPerDay.forEach((item,index) => {
            ctx.beginPath();
            ctx.arc(50+index*relW, canvas.height-item[2]*relH-5, d, 0, 2*Math.PI);
            ctx.fill();
        })

        canvas.onmousemove = (e) => {
            const loc = this.windowToCanvas(canvas, e.clientX, e.clientY);
            wordsPerDay.forEach((item,index) => {
                if ((loc.x >= 50+index*relW-15 && loc.x <= 50+index*relW+15)
                    && (loc.y >= canvas.height-item[2]*relH-15 && loc.y <= canvas.height-item[2]*relH+15)) {
                    const tooltipPos = {
                        left: 50+index*relW,
                        top: canvas.height-item[2]*relH-65
                    }
                    const tooltipText = {
                        date: `${item[0]}`,
                        words: `+${item[1]}`
                    }
                    this.setState({tooltipPos: tooltipPos, tooltipText: tooltipText});
                }
            })
        };

        canvas.onmouseout = (e) => {
            this.setState({tooltipPos: {}, tooltipText: {}});
        }

    }

    drawGrid = (ctx, h, w, max) => {
        for (let x = 50; x <= w; x += 100) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
        }
          
        for (let y = 0; y <= h; y += 30) {
            ctx.moveTo(40, y);
            ctx.lineTo(w-40, y);
        }
          
        ctx.strokeStyle = "rgba(168, 167, 167, 0.6)";
        ctx.stroke();
    }

    drawChartAxis = (ctx, h, max) => {
        ctx.moveTo(0, 0);
        for (let y = h; y > 30; y -= 30) {
            ctx.fillStyle = 'rgb(168, 167, 167)'
            ctx.font = "20px sans-serif";
            ctx.fillText(Math.floor(((h-y)/30)*(max/10)), 0, y);
        }
    }

    windowToCanvas = (canvas, x, y) => {
        const bbox = canvas.getBoundingClientRect();
        return { x: x - bbox.left * (canvas.width / bbox.width),
            y: y - bbox.top * (canvas.height / bbox.height)
        };
    }

    render() {
        const tooltipStyle = {
            position: 'absolute',
            top: this.state.tooltipPos.top,
            left: this.state.tooltipPos.left
        }
        return (
            <div className="general-stat-container">
                <div className="general-stat-summary">
                    <p className="general-stat-words-count">Изучено слов: {this.state.learnedWordsCount}</p>
                    <p className="general-stat-date-of-reg">Дата регистрации пользователя: {this.state.dateOfReg}</p>
                </div>
                <div className="general-stat-canvas-container">
                    {this.state.tooltipText.date ? <div className="general-stat-tooltip" style={tooltipStyle}>
                        <p>{this.state.tooltipText.date}</p>
                        <p>{this.state.tooltipText.words}</p>
                    </div> : ''}
                    <canvas ref="canvas" width={600} height={305}/>
                </div>
            </div>
        )
    }
}

export default GeneralStat;