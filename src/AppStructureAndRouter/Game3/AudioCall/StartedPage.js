import React from "react";

export default class StartedPage extends React.Component{


    render() {
        return (
            <div>
                <div>
                    <p>Audio-Call</p>
                    <button onClick={() => this.props.startGame()}>Начать</button>
                </div>
            </div>
        )
    }
}