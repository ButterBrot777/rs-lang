import React from "react";
export  default function StartedPage(prop) {
    return (
        <button onClick={() => prop.setGameState({...prop.state, startedPage: false})}> Начать</button>
    )
}