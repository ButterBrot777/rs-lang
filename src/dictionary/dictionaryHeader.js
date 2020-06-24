import React from 'react';

class DictionaryHeader extends React.Component {

    render() {
        return (
            <div className="dictionary-buttons">
                <button className={this.props.words === "learning" ? "btn active" : "btn"} onClick={this.props.getLearning}>Изучаемые слова</button>
                <button className={this.props.words === "hard" ? "btn active" : "btn"} onClick={this.props.getHard}>Сложные слова</button>
                <button className={this.props.words === "deleted" ? "btn active" : "btn"} onClick={this.props.getDeleted}>Удалённые слова</button>
            </div>
        )
    }

}

export default DictionaryHeader;