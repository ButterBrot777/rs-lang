import React from 'react';
const IMAGE_URL = 'https://raw.githubusercontent.com/NastiaKoval/rslang-data/master/';
const WORD_URL = 'https://afternoon-falls-25894.herokuapp.com/words/';

class Word extends React.Component {
    constructor(props) {
        super(props);
        this.difficulty = props.difficulty;
        this.wordId = props.wordId;
        this.state = {
            data: {},
            isLoading: false,
        }
    }

    componentDidMount() {
        this.setState({ isLoading: true });
        const url = `${WORD_URL}${this.wordId}`;
        fetch(url)
            .then(response => response.json())
            .then(data => this.setState({data: data, isLoading: false,}))
    }
    render() {
        const { data, isLoading } = this.state;
        const IMAGE = `${IMAGE_URL}${data.image}`
        if (isLoading) {
          return <p>Loading ...</p>;
        }
        return (
            <div className="dictionary-word-container">
                <h3 className="word">{data.word}</h3>
                <p className="translation">{data.wordTranslate}</p>
                <p className="meaning">{data.textMeaning}</p>
                <p className="example">{data.textExample}</p>
                <p className="transcription">{data.transcription}</p>
                <img className="image" src={IMAGE} alt={data.word} />  
                <p className="last-train">{this.props.optional.lastTrain}</p>  
                <p className="repeats">{this.props.optional.repeats}</p>  
                <p className="next-train">{this.props.optional.nextTrain}</p>  
            </div>
        )
    }
}

export default Word;