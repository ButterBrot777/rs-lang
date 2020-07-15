import React from "react";

export default class StartedPage extends React.Component{


    render() {
        return (
            <div className={'start__page__main'}>
                <div className={'started__page__container'}>
                    <p className={'started__page__head'}>Audio-Call</p>
                    <p className={'started__page__text'}>Listen word and choose right</p>
                    <p className={'started__page__text'}>You can use buttons to chose word</p>
                    <button className={'button button_bordered'} onClick={() => this.props.startGame()}>Начать</button>
                </div>
            </div>
        )
    }
}