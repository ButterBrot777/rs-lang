import React from 'react';
import soundIcon from './assets/sound.png';
import './Game1.css';
class Card extends React.Component {
    render() {
        const { id, audio, transcription, word, wordTranslate } = this.props.wordObj;
        const card = (this.props.isStatistics) ? "speakit__results-card" :
            (!this.props.isStatistics && this.props.currentObj.id === id) ? "speakit__card speakit__card-active" : "speakit__card";
        return (
            this.props.isStatistics ?
                (
                    <div data-id={id} className={card}>
                        <img src={soundIcon} onClick={() => this.props.playSound(audio)}
                            className="speakit__card-icon" alt="soundIcon"></img>
                        <span className="speakit__bold speakit__results-text">{word}</span>
                        <span className="speakit__results-text">{transcription}</span>
                        <span className="speakit__results-text">{wordTranslate}</span>
                    </div>) : (
                    <div data-id={id} onClick={(e) => this.props.onCardClick(e)} className={card}>
                        <img src={soundIcon} className="speakit__card-icon" alt="soundIcon"></img>
                        <div className="speakit__card-text">
                            <div className="bold">{word}</div>
                            <div >{transcription}</div>
                        </div>
                    </div>)
        )
    }
}

export default Card;