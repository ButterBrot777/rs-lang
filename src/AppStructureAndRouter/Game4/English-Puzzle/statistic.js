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
            <div className="puzzle-statistic-info">
                <div className="puzzle-knowledge-info">
                <p className="puzzle-final-message">I know: {prop.state.statistic.trueWords.length}</p>
                {prop.state.statistic.trueWords.map((e,i) => <StatisticString wordData = {e} index = {i} key = {i}/>  )}
                <p className="puzzle-final-message">I dont know: {prop.state.statistic.falseWords.length}</p>
                {prop.state.statistic.falseWords.map((e,i) => <StatisticString wordData = {e} index = {i} key = {i} />  )}
            </div>
        </div>
        <div className="puzzle-statistic-button-container">
            <button className="button button_colored" onClick = {() => newGame()} >Continue</button>
        </div>
        </div>
    )
}