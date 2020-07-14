import React from 'react';
import audio_icon from './audio-icon.png';
import { updateUserWord, getWordData } from '../ServerRequest/ServerRequests';
import { createDateFromTimestamp } from '../Statistics/dateConverter';
const BRACKETS_REGEXP = new RegExp(/<[/\w]+>/g);

class Word extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            image: "",
            tooltipPos: {},
            tooltipText: '',
            isLoading: false
        }
    }

    componentDidMount = async () => {
        this.setState({ isLoading: true });
        const data = await getWordData(this.props.wordId);
        this.setState({data: data, image: data.image, isLoading: false,});
        this.drawDots();
    }

    putToLearning = async () => {
        const wordObj = {
            "difficulty": 'good',
            "optional": {
                "deleted": false,
                "hardWord": false,
                "repeatsStreak": 1,
                "repeatsTotal": this.props.optional.repeatsTotal,
                "lastTrain": this.props.optional.lastTrain,
                "nextTrain": this.props.optional.nextTrain
            }
        }
        const content = await updateUserWord(this.props.wordId, wordObj);
        this.setState({isLoading: false});
        this.props.onWordTypeChange(content);
    }

    playAudio = () => {
        this.setState({isLoading: false});
        const audioUrl = `data:audio/mpeg;base64,${this.state.data.audio}`;
        if (this.wordAudio) {
            this.wordAudio.pause();
          }
        this.wordAudio = new Audio(audioUrl);
        this.wordAudio.load();
        this.wordAudio.play();
    }

    drawDots = () => {
        const canvas = this.refs.canvas;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        const d = 5;
        ctx.fillStyle='rgb(19,40,59)';
        ctx.beginPath();
        ctx.arc(5, 10, d, 0, 2*Math.PI);
        ctx.fill();
        let level = 0;
        if (this.props.difficulty === 'hard' && this.props.optional.repeatsTotal <= 2) {
            level = 1;
            ctx.beginPath();
            ctx.arc(20, 10, d, 0, 2*Math.PI);
            ctx.fill();
            ctx.fillStyle='rgba(168, 167, 167, 0.6)';
            for (let i = 2; i < 5; i++) {
                ctx.beginPath();
                ctx.arc(5+15*i, 10, d, 0, 2*Math.PI);
                ctx.fill();
            }
        } else if ((this.props.difficulty === 'hard' && this.props.optional.repeatsTotal > 2) || (this.props.difficulty === 'good' && this.props.optional.repeatsTotal <= 2)) {
            level = 2;
            for (let i = 1; i < 3; i++) {
                ctx.beginPath();
                ctx.arc(5+15*i, 10, d, 0, 2*Math.PI);
                ctx.fill();
            }
            ctx.fillStyle='rgba(168, 167, 167, 0.6)';
            for (let i = 3; i < 5; i++) {
                ctx.beginPath();
                ctx.arc(5+15*i, 10, d, 0, 2*Math.PI);
                ctx.fill();
            }
        } else if ((this.props.difficulty === 'good' && this.props.optional.repeatsTotal > 2) || (this.props.difficulty === 'easy' && this.props.optional.repeatsTotal <= 2)) {
            level = 3;
            for (let i = 1; i < 4; i++) {
                ctx.beginPath();
                ctx.arc(5+15*i, 10, d, 0, 2*Math.PI);
                ctx.fill();
            }
            ctx.fillStyle='rgba(168, 167, 167, 0.6)';
            for (let i = 4; i < 5; i++) {
                ctx.beginPath();
                ctx.arc(5+15*i, 10, d, 0, 2*Math.PI);
                ctx.fill();
            }
        } else if (this.props.difficulty === 'easy' && this.props.optional.repeatsTotal > 2) {
            level = 4;
            for (let i = 1; i < 5; i++) {
                ctx.beginPath();
                ctx.arc(5+15*i, 10, d, 0, 2*Math.PI);
                ctx.fill();
            }
        } else {
            ctx.fillStyle='rgba(168, 167, 167, 0.6)';
            for (let i = 1; i < 5; i++) {
                ctx.beginPath();
                ctx.arc(5+15*i, 10, d, 0, 2*Math.PI);
                ctx.fill();
            }
        }

        const tooltipTextVariants = [
            'New word. Never played in daily train',
            'You need to learn this word',
            'You are learning this word',
            'This word is common for you',
            'You have an excellent memory'
        ]

        canvas.onmouseover = () => {
            const tooltipPos = {
                left: 0,
            }
            const tooltipText = tooltipTextVariants[level];
            this.setState({ tooltipPos: tooltipPos, tooltipText: tooltipText });
        }

        canvas.onmouseout = () => {
            this.setState({ tooltipPos: {}, tooltipText: '' });
        }
    }

    render() {
        const { data, image, isLoading } = this.state;
        const lastTrainDate = createDateFromTimestamp(this.props.optional.lastTrain);
        const nextTrainDate = createDateFromTimestamp(this.props.optional.nextTrain);
        const imageSrc = `data:image/jpg;base64,${image}`;
        if (data.textMeaning &&  data.textExample) {
            data.textMeaning = data.textMeaning.replace(BRACKETS_REGEXP, "");
            data.textExample = data.textExample.replace(BRACKETS_REGEXP, "");
        }

        const tooltipStyle = {
            position: 'absolute',
            left: this.state.tooltipPos.left
        }
       
        if (isLoading) {
          return <p>Loading ...</p>;
        }
        return (
            <div className="dictionary-word-container" >
                <div className="word-info">
                    <div className="word-main-info">
                        <div className="word-text">
                            <div className="word-audio">
                                <h3 className="dictionary-word">{data.word}</h3>
                                <button className="audio-icon-btn" onClick={this.playAudio}><img className="audio-icon" src={audio_icon} alt="audio icon" /></button>
                            </div>
                            {this.props.transcriptionInfo ? <p className="dictionary-transcription">{data.transcription}</p> : ''}
                            <p className="dictionary-translation">{data.wordTranslate}</p>
                            {this.props.meaningInfo ? <p className="dictionary-meaning">{data.textMeaning}</p> : ''}
                            {this.props.exampleInfo ? <p className="dictionary-example">{data.textExample}</p> : ''}
                            <div className="dictionary-word-canvas-container">
                                <canvas ref="canvas" width={200} height={30}/>
                                {this.state.tooltipText ? <div className="dictionary-word-tooltip" style={tooltipStyle}>
                                    <p>{this.state.tooltipText}</p>
                                </div> : ''}
                            </div>
                            
                        </div>
                        {this.props.imageInfo ? <img className="dictionary-image" src={imageSrc} alt={data.word} /> : ''}
                    </div>
                    <div className="word-learning-info">
                        <p className="dictionary-last-train"> Last train: {lastTrainDate}</p>  
                        <p className="dictionary-repeats">Repeats: {this.props.optional.repeatsTotal}</p>  
                        <p className="dictionary-next-train">Next train: {nextTrainDate}</p>
                    </div>
                </div>
                <div className="put-to-learning-btn-container">
                    {this.props.words === "hard" || this.props.words === "deleted" ? <button className="dictionary-btn put-to-learning-btn" onClick={this.putToLearning}>Restore</button> : ''}
                </div>
            </div>
        )
    }
}

export default Word;
