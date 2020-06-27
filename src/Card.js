import React from 'react';
import soundIcon from './assets/sound.png';
import './index.css';
class Card extends React.Component {
    render() {
        const { id, audio, transcription, word, wordTranslate } = this.props.wordObj;
        const card = (this.props.isStatistics) ? "results__card" :
            (!this.props.isStatistics && this.props.currentObj.id === id) ? "card card-active" : "card";
        return (
            this.props.isStatistics ?
                (
                    <div data-id={id} className={card}>
                        <img src={soundIcon} onClick={() => this.props.playSound(audio)}
                            className="card__icon" alt="soundIcon"></img>
                        <span className="bold results__text">{word}</span>
                        <span className="results__text">{transcription}</span>
                        <span className="results__text">{wordTranslate}</span>
                    </div>) : (
                    <div data-id={id} onClick={(e) => this.props.onCardClick(e)} className={card}>
                        <img src={soundIcon} className="card__icon" alt="soundIcon"></img>
                        <div className="card__text">
                            <div className="bold">{word}</div>
                            <div >{transcription}</div>
                        </div>
                    </div>)
        )
    }
}

export default Card;