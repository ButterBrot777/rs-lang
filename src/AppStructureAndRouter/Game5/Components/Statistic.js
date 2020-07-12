import React, {Component} from 'react';
import {BrowserRouter as Router,Link} from "react-router-dom";

import './Statistic.css'
class Statistic extends Component{
  constructor(){
    super()
    this.state={
    }
    this.handleCardClick = this.handleCardClick.bind(this)
  }

  handleCardClick = (e) => {
    if (!this.state.isRecognition) {
      let currId = e.target.closest('.card').dataset.id;
      let currentObj = this.state.fullData.find(el => el.id === currId);
        this.setState({
          currentObj
        })
      this.playSound(currentObj.audio);
    }
}
  render(){
    return(
      <div className="results">
        <div className="results-container">
          <p className="errors">Ошибок
            <span className="errors-number">{this.props.true.length}</span>
          </p>
          <div className="error-items">
            {this.props.true.map(wordObj =>
              <Card wordObj={wordObj} 
                    key={wordObj.id}
                    onCardClick={this.handleCardClick} />
            )}
          </div>
            <p className="success">Знаю
              <span className="success-number">{this.props.false.length}</span>
            </p>
          <div className="success-items">
            {this.props.false.map(wordObj =>
              <Card wordObj={wordObj} 
                    key={wordObj.id} 
                    onCardClick={this.handleCardClick} />
            )}
          </div>
          <div className="results__btns">
            <Link to='/HomePage'><button>HomePage</button></Link>
            <button>New Game</button>
          </div>
        </div>
      </div>
    )
  }
}
class Card extends React.Component {
  render() {
    const { id, audio, transcription, word, wordTranslate } = this.props.wordObj;
    const card =  "card";
    const card1 = "results__card"
    const card2 = "card-active"
    return (
      <div data-id={id} className={card1}>
        <img onClick={() => this.props.playSound(audio)} className="card__icon" alt="soundIcon"></img>
          <span className="bold results__text">{word}</span>
          <span className="results__text">{transcription}</span>
          <span className="results__text">{wordTranslate}</span>
        </div>
    )
  }
}

export default Statistic