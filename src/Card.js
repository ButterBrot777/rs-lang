import React from 'react';

import './index.css';

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
                        return <span className="sentence__word colored" key={idx}>[ ... ]</span>
                    }
                    return <span className="sentence__word" key={idx}>{word}</span>
                })
        }
    }

    render() {
        let exampleBlock;
        if (this.props.settings.isExample) {
            if (this.props.isSkipped || this.props.isGuessed) {
                exampleBlock = <div dangerouslySetInnerHTML={{ __html: `${this.props.wordData.textExample}` }}></div>;;
            } else {
                exampleBlock = this.createWordElements(this.props.wordData.textExample);
            }
        } else {
            exampleBlock = '';
        }

        let meaningBlock;
        if (this.props.settings.isMeaning) {
            if (this.props.isSkipped || this.props.isGuessed) {
                meaningBlock = <div dangerouslySetInnerHTML={{ __html: `${this.props.wordData.textMeaning}` }}></div>;
            } else {
                meaningBlock = this.createWordElements(this.props.wordData.textMeaning)
            }
        } else {
            meaningBlock = '';
        }

        let translationBlock = this.props.settings.isTranslation ? this.props.wordData.wordTranslate : '';

        let transcriptionBlock = this.props.settings.isTranscription ? this.props.wordData.transcription : '';

        let image = `https://raw.githubusercontent.com/22-22/rslang/rslang-data/data/${this.props.wordData.image}`;
        let imageBlock = this.props.settings.isImage ? <img src={image} alt=""></img> : '';

        return (
            <div className="word-card">
                <div className="word-card-text">
                    <div>{exampleBlock}</div>
                    {(this.props.isGuessed && this.props.settings.isExample) ? <div>{this.props.wordData.textExampleTranslate}</div> : ''}
                    <div>{meaningBlock}</div>
                    {(this.props.isGuessed && this.props.settings.isMeaning) ? <div>{this.props.wordData.textMeaningTranslate}</div> : ''}
                    <div>{translationBlock}</div>
                    <div>{transcriptionBlock}</div>
                </div>
                <div>{imageBlock}</div>
            </div>
        )
    }
}

export default Card;