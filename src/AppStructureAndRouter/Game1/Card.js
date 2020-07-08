import React from 'react';
import './Game1.css';

const regexpBrackets = new RegExp(/<[^>]*>/ig);

class Card extends React.Component {
    splitSentenceIntoWords = (sentence) => {
        return sentence
            .slice(0, sentence.length - 1)
            .split(' ')
    }

    createWordElements = (sentence) => {
        if (sentence) {
            let arr = this.splitSentenceIntoWords(sentence);
            return arr
                .map((word, idx) => {
                    if (regexpBrackets.test(word)) {
                        return <span className="sentence__word colored" key={idx}>[...]</span>
                    }
                    return <span className="sentence__word" key={idx}>{word}</span>
                })
        }
    }

    render() {
        let exampleBlock;
        if (this.props.hints.exampleHint) {
            if (this.props.isSkipped || this.props.isGuessed || this.props.isDifficultyChoice) {
                exampleBlock = <div dangerouslySetInnerHTML={{ __html: `${this.props.wordData.textExample}` }}></div>;;
            } else {
                exampleBlock = this.createWordElements(this.props.wordData.textExample);
            }
        } else {
            exampleBlock = '';
        }
        let meaningBlock;
        if (this.props.hints.meaningHint) {
            if (this.props.isSkipped || this.props.isGuessed || this.props.isDifficultyChoice) {
                meaningBlock = <div dangerouslySetInnerHTML={{ __html: `${this.props.wordData.textMeaning}` }}></div>;
            } else {
                meaningBlock = this.createWordElements(this.props.wordData.textMeaning)
            }
        } else {
            meaningBlock = '';
        }
        let translationBlock = this.props.hints.translationHint ? this.props.wordData.wordTranslate : '';
        let transcriptionBlock = this.props.hints.transcriptionHint ? this.props.wordData.transcription : '';
        let image = `https://raw.githubusercontent.com/22-22/rslang/rslang-data/data/${this.props.wordData.image}`;
        let imageBlock = this.props.hints.imageHint ? <img onLoad={this.props.handleImgLoading} src={image} alt=""></img> : '';
        return (
            <div className={this.props.isImageLoaded? "word-card" : "word-card hidden"}>
                <div className="word-card-text">
                    <div>{exampleBlock}</div>
                    {(this.props.isGuessed && this.props.hints.exampleHint) || (this.props.isDifficultyChoice && this.props.hints.exampleHint) ? <div>{this.props.wordData.textExampleTranslate}</div> : ''}
                    <div>{meaningBlock}</div>
                    {(this.props.isGuessed && this.props.hints.meaningHint) || (this.props.isDifficultyChoice && this.props.hints.meaningHint) ? <div>{this.props.wordData.textMeaningTranslate}</div> : ''}
                    <div>{translationBlock}</div>
                    <div>{transcriptionBlock}</div>
                </div>
                <div>{imageBlock}</div>
            </div>
        )
    }
}

export default Card;
