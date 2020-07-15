import React from 'react';
import './BasicGame.css'

class LettersInput extends React.Component {

    addCorrectWord = () => {
        let inputAttempt = this.props.inputAttempt.split('');
        let currentWord = this.props.word.split('');
        if (this.props.coloredLetters) {
            return currentWord.map((letter, idx) => {
                if (letter === inputAttempt[idx]) {
                    return <span className="correct" key={idx}>{letter}</span>
                } else {
                    return <span className="incorrect" key={idx}>{letter}</span>
                }
            })
        } else {
            return currentWord.map((letter, idx) => <span key={idx}>{letter}</span>)
        }
    }

    render() {
        return (
            <div className="input-container">
                <div className={(this.props.isGuessCheck) ? "word-current opaque" : "word-current opaque hidden"}>
                    {
                        this.addCorrectWord()
                    }
                </div>
                <input
                    type="text" className="word-input" 
                    readOnly={(this.props.isGuessed || this.props.isSkipped) ? true : false}
                    autoFocus={true} autoComplete="off" value={this.props.value}
                    onChange={(e) => this.props.handleInputChange(e.target.value)}
                ></input>
            </div>
        )
    }
}

export default LettersInput;