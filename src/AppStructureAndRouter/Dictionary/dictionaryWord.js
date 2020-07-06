import React from 'react';
import audio_icon from './audio-icon.png';
import { updateUserWord } from '../ServerRequest/ServerRequests';
const WORD_URL = 'https://afternoon-falls-25894.herokuapp.com/words/';
const BRACKETS_REGEXP = new RegExp(/<[/\w]+>/g);

const userId = localStorage.getItem('userId');
const token = localStorage.getItem('token');
let user = {
  userId,
  token
};

class Word extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            image: "files/01_0001.jpg",
            isLoading: false
        }
    }

    componentDidMount() {
        this.setState({ isLoading: true });
        const url = `${WORD_URL}${this.props.wordId}`;
        fetch(url)
            .then(response => response.json())
            .then(data => this.setState({data: data, image: data.image, isLoading: false,}))
    }



    putToLearning = async () => {
        const wordObj = {
            "difficulty": "good",
            "optional": {
                "deleted": false,
                "hardWord": false,
                "repeatsStreak": 1,
                "repeatsTotal": this.props.optional.repeatsTotal,
                "lastTrain": this.props.optional.lastTrain,
                "nextTrain": this.props.optional.nextTrain
            }
        }
        const updatedWord = {
            userId : user.userId,
            token: user.token,
            wordId: this.props.wordId,
            word: wordObj
        } 
        const content = await updateUserWord(updatedWord);
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

    createDateFromTimestamp = (timestamp) => {
        const dateObj = new Date(timestamp); 
        return `${dateObj.getDate()}.${dateObj.getMonth()}.${dateObj.getFullYear()}`;
    }
    render() {
        const { data, image, isLoading } = this.state;
        const lastTrainDate = this.createDateFromTimestamp(this.props.optional.lastTrain);
        const nextTrainDate = this.createDateFromTimestamp(this.props.optional.nextTrain);
        const imageSrc = `data:image/jpg;base64,${image}`;
        if (data.textMeaning &&  data.textExample) {
            data.textMeaning = data.textMeaning.replace(BRACKETS_REGEXP, "");
            data.textExample = data.textExample.replace(BRACKETS_REGEXP, "");
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
                        </div>
                        {this.props.imageInfo ? <img className="dictionary-image" src={imageSrc} alt={data.word} /> : ''}
                    </div>
                    <div className="word-learning-info">
                        <p className="dictionary-last-train"> Последняя тренировка: {lastTrainDate}</p>  
                        <p className="dictionary-repeats">Кол-во повторений: {this.props.optional.repeatsTotal}</p>  
                        <p className="dictionary-next-train">Следующая тренировка: {nextTrainDate}</p>
                    </div>
                </div>
                {this.props.words === "hard" || this.props.words === "deleted" ? <button className="dictionary-btn put-to-learning-btn" onClick={this.putToLearning}>Восстановить</button> : ''} 
            </div>
        )
    }
}

export default Word;
