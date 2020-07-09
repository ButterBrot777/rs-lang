import React from 'react';
import './BasicGame.css'

class LettersInput extends React.Component {

    addColor = () => {
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
                <div className="word-current opaque">
                    {(this.props.isGuessCheck) &&
                        this.addColor()
                    }
                </div>
                <input
                    type="text" className="word-input"
                    autoFocus={true} autoComplete="off" value={this.props.value}
                    onChange={(e) => this.props.handleInputChange(e.target.value)}
                ></input>
            </div>
        )
    }
}

export default LettersInput;