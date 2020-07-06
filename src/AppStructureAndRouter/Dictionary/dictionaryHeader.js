import React from 'react';

class DictionaryHeader extends React.Component {

    render() {
        return (
            <div className="dictionary-header-buttons">
                <button className={this.props.words === "learning" ? "dictionary-btn active" : "dictionary-btn"} onClick={this.props.getLearning}>Изучаемые слова</button>
                <button className={this.props.words === "hard" ? "dictionary-btn active" : "dictionary-btn"} onClick={this.props.getHard}>Сложные слова</button>
                <button className={this.props.words === "deleted" ? "dictionary-btn active" : "dictionary-btn"} onClick={this.props.getDeleted}>Удалённые слова</button>
            </div>
        )
    }

}

export default DictionaryHeader;