import React from 'react';

class DictionaryHeader extends React.Component {

    render() {
        return (
            <div className="dictionary-header-buttons">
                <button className={this.props.words === "learning" ? "dictionary-btn active" : "dictionary-btn"} onClick={this.props.getLearning}>Learned words</button>
                <button className={this.props.words === "hard" ? "dictionary-btn active" : "dictionary-btn"} onClick={this.props.getHard}>Hard words</button>
                <button className={this.props.words === "deleted" ? "dictionary-btn active" : "dictionary-btn"} onClick={this.props.getDeleted}>Deleted words</button>
            </div>
        )
    }

}

export default DictionaryHeader;