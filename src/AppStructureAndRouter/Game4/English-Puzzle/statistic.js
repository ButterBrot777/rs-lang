import React, {useEffect} from "react";
import StatisticString from "../StatisticString";
import paintings1 from "./PathObjects/level1";
import {getUserWord, createUserWord, updateUserWord} from '../../ServerRequest/ServerRequests';

export default function Statistic(prop) {

    useEffect(() => {

    }, []);

    const userId = localStorage.getItem('userId');


    function newGame() {
        localStorage.setItem('imageCount', `${prop.state.imageCount + 1}`);
        prop.setState({
            ...prop.state,
            loading: true,
        })
        prop.newGame(userId)

    }

    return (
        <div>
            <div>
                <img
                    src={`https://raw.githubusercontent.com/jules0802/rslang_data_paintings/master/${prop.state.image.cutSrc}`}/>
                <p>{`${prop.state.image.author}-${prop.state.image.name} (${prop.state.image.year})`}</p>
            </div>
            <div>
                <div>
                    <p>I dont know {prop.state.statistic.trueWords.length}</p>
                    {prop.state.statistic.trueWords.map((e, i) => <StatisticString wordData={e} key={i} index={i}/>)}
                </div>
                <div>
                    <p>I know {prop.state.statistic.falseWords.length}</p>
                    {prop.state.statistic.falseWords.map((e, i) => <StatisticString wordData={e} key={i} index={i}/>)}
                </div>
            </div>
            <div>
                <button onClick={() => newGame()}>Continue</button>
            </div>
        </div>
    )
}