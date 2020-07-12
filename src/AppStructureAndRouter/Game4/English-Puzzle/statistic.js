import React from "react";
import StatisticString from "../StatisticString";
import paintings1 from "./PathObjects/level1";

export default function Statistic(prop) {
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array

    };

    function newGame(array){
        let imageCount = prop.state.imageCount + 1;
        localStorage.setItem('imageCount',`${imageCount}`);
        let image = paintings1[imageCount];
        let dataArray = array;
        dataArray = dataArray.filter(e => e.textExample
            .split(' ')
            .filter((e,i,array) => array.indexOf(e) !== array.lastIndexOf(e)).length === 0
        );
        let str = shuffle(dataArray[0].textExample.split(' '));
        let currentStr = dataArray[0].textExample.split(' ');
        let lengthCurrent = currentStr.map(e => e.length)
        let strExample = str.slice(0);
        let wordLength = strExample.length
        let length = str.map(e => e.length).reduce((acc,curr) => acc + curr,0);
        let lengthArray = str.map(e => e.length);

        let emptyArray = new Array(str.length).fill('');
        console.log('ggggg',dataArray);
        prop.setState({
                ...prop.state,
                stringCount:0,
                canClicked: true,
                imageCount:imageCount,
                image:image,
                lengthArrayCurrent:lengthCurrent,
                currentStr:currentStr,
                gameData: dataArray,
                loading:false,
                chosenWords:emptyArray,
                currentString:str,
                strExample:strExample,
                length:length,
                lengthArray:lengthArray,
                wordLength:wordLength,
                endScreen: false,
                statisticScreen:false,
                lastStrings:[],
                completed:false,
            }
        )


    }

    return (
        <div>
            <div>
                <img src={`https://raw.githubusercontent.com/jules0802/rslang_data_paintings/master/${prop.state.image.cutSrc}`} />
                <p>{`${prop.state.image.author}-${prop.state.image.name} (${prop.state.image.year})`}</p>
            </div>
            <div>
                <div>
                    <p>I dont know {prop.state.statistic.trueWords.length}</p>
                    {prop.state.statistic.trueWords.map((e,i) => <StatisticString wordData = {e} index = {i} />  )}
                </div>
                <div>
                    <p>I know {prop.state.statistic.falseWords.length}</p>
                    {prop.state.statistic.falseWords.map((e,i) => <StatisticString wordData = {e} index = {i} />  )}
                </div>
            </div>
            <div>
                <buttton onClick = {() => newGame(prop.state.gameData.slice(10))} >Continue</buttton>
            </div>
        </div>
    )
}