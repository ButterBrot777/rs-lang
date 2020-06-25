import React from "react";
export default class Statistic extends React.Component {

    render() {
        return (
            <div>
                <div>Закрыть</div>
                <div>
                    <p>Правильные {this.props.statistic.RightWords.length}</p>
                    {this.props.statistic.RightWords.map((e) => <StatisticString word = {e} />) }
                </div>
                <div >
                    <p>Неправильые {this.props.statistic.FalseWords.length}</p>
                    {this.props.statistic.FalseWords.map((e) => <StatisticString word = {e} />) }
                </div>
            </div>

        )
    }
}

class StatisticString extends React.Component {
    playSound = () => {
        let sound = new Audio(`https://raw.githubusercontent.com/22-22/rslang/rslang-data/data/${this.props.word.audio}`);
        sound.play()
    };
    render() {
        return (
            <div className='Statistic__word' onClick={() => this.playSound()}>
                <div>Sound</div>
                <p>{this.props.word.word}</p>
                <p>{this.props.word.wordTranslate}</p>
            </div>
        )
    }
}

