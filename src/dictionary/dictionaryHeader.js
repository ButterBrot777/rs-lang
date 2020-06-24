import React from 'react';

class DictionaryHeader extends React.Component {

    render() {
        return (
            <div className="dictionary-header">
                <button className={this.props.words === "all" ? "btn active" : "btn"} onClick={this.props.getAll}>Изучаемые слова</button>
                <button className={this.props.words === "hard" ? "btn active" : "btn"} onClick={this.props.getHard}>Сложные слова</button>
                <button className={this.props.words === "deleted" ? "btn active" : "btn"} onClick={this.props.getDeleted}>Удалённые слова</button>
            </div>
        )
    }

}

export default DictionaryHeader;