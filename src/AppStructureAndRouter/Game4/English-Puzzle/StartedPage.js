import React from "react";

export default function StartedPage(prop) {
    return (

        <div className={'start__page__main__bg'}>
            <div className={'start__page__main__container'}>
                <p>English Puzzle</p>
                <p>Click on words, collect phrases.</p>
                <p>Words can be drag and drop. Select tooltips in the menu</p>
                <button onClick={() => prop.setGameState({...prop.state, startedPage: false})}> Начать</button>
            </div>
        </div>
    )
}