import React from "react";
export  default function StartedPage(prop) {
    return (

        <div className={'start__page__main__bg'}>
            <div className={'start__page__main__container'}>
                <h2>English Puzzle</h2>
                <h3>Click on words, collect phrases.</h3>
                <button className="button button_bordered" onClick={() => prop.setGameState({...prop.state, startedPage: false})}>Play</button>
            </div>
        </div >
    )
}