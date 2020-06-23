import React from 'react';
import './index.css';

class Input extends React.Component {

    render() {
        let arr = this.props.word.split('');
        return (
            <div className="input-container">
                <div ref={this.props.wordContainerRef}  className="opaque hidden" >
                    {
                        arr.map((letter, idx) => {
                            return <span key={idx}>{letter}</span>
                        })
                    }
                </div>
                <input 
                type="text" className="word-input" ref={this.props.inputRef} 
                autoFocus autoComplete="off" value={this.props.value}
                    onChange={(e) => this.props.handleInputChange(e.target.value)}
                ></input>
            </div>
        )
    }
}

export default Input;