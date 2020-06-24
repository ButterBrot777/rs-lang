import React from 'react';
const IMAGE_URL = 'https://raw.githubusercontent.com/NastiaKoval/rslang-data/master/';
const WORD_URL = 'https://afternoon-falls-25894.herokuapp.com/words/';

class Word extends React.Component {
    constructor(props) {
        super(props);
        this.difficulty = props.difficulty;
        this.wordId = props.wordId;
        this.wordsType = props.words;
        this.putToLearning = this.putToLearning.bind(this);
        this.state = {
            data: {},
            image: "files/01_0001.jpg",
            isLoading: false,
        }
    }

    componentDidMount() {
        this.setState({ isLoading: true });
        const url = `${WORD_URL}${this.wordId}`;
        fetch(url)
            .then(response => response.json())
            .then(data => this.setState({data: data, image: data.image, isLoading: false,}))
    }

    putToLearning = async () => {
        const user_words_update_url = `https://afternoon-falls-25894.herokuapp.com/users/${this.props.userId}/words/${this.wordId}`;
        const word_obj = {
            "difficulty": "good",
            "optional": {
                "deleted": false,
                "hardWord": false,
                "lastTrain": this.props.optional.lastTrain,
                "nextTrain": this.props.optional.nextTrain,
                "repeats": this.props.optional.repeats
            }
        }
        const rawResponse = await fetch(user_words_update_url, {
            method: 'PUT',
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${this.props.token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(word_obj)
        });

        const content = await rawResponse.json();
        this.setState({isLoading: false});
        this.props.onWordTypeChange(content);
    }

    render() {
        const { data, image, isLoading } = this.state;
        if (isLoading) {
          return <p>Loading ...</p>;
        }
        return (
            <div className="dictionary-word-container" >
                <h3 className="word">{data.word}</h3>
                <p className="translation">{data.wordTranslate}</p>
                <p className="meaning">{data.textMeaning}</p>
                <p className="example">{data.textExample}</p>
                <p className="transcription">{data.transcription}</p>
                <img className="image" src={`${IMAGE_URL}${image}`} alt={data.word} />
                <p className="last-train">{this.props.optional.lastTrain}</p>  
                <p className="repeats">{this.props.optional.repeats}</p>  
                <p className="next-train">{this.props.optional.nextTrain}</p>
                {this.wordsType === "hard" || this.wordsType === "deleted" ? <button className="put-to-learning-btn" onClick={this.putToLearning}>Восстановить</button> : ''}  
            </div>
        )
    }
}

export default Word;
