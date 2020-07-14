import React, {useEffect} from "react";
import paintings1 from "./PathObjects/level1";

export default function EndScreen(prop) {
    useEffect(() => {
        sendStatistic()
    },[])

    const userId = localStorage.getItem('userId');
    console.log('юзерIд',userId)
    const token = localStorage.getItem('token');
    const baseUrl = 'https://afternoon-falls-25894.herokuapp.com'

    function showStatistic() {
        prop.setState({
            ...prop.state,
            endScreen:false,
            statisticScreen:true,
        })
    }
    function sendStatistic() {
        getStatisticsUser().then( data =>{
           data.optional["puzzle"][`${+new Date()}`] = {
                "errors": prop.state.statistic.falseWords.length, // кол-во ошибок
                "trues": prop.state.statistic.trueWords.length // кол-во правильных ответов
            };
            delete data.id
            let stat = data;
            updateStatisticsUser(stat)
            }
        )
    }

    const getStatisticsUser = async () => {
        const rawResponse = await fetch(`${baseUrl}/users/${userId}/statistics`, {
            method: 'GET',
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
        });
        const content = await rawResponse.json();
        console.log('статистика',content)
        return content;
    };

    const updateStatisticsUser = async (statisticsData) => {
        const rawResponse = await fetch(`${baseUrl}/users/${userId}/statistics`, {
            method: 'PUT',
            withCredentials: true,
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(statisticsData)
        });
        const content = await rawResponse.json();
        console.log('ответ',content)
        return content;
    };


    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array

    };

    function newGame(array){
        let imageCount = prop.state.imageCount + 1;
        localStorage.setItem('imageCount',`${imageCount}`)
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
                lastStrings:[],
                completed:false,
            }
        )


    }


    return (
        <div className={'end__screen__main'}>
            <img src={`https://raw.githubusercontent.com/jules0802/rslang_data_paintings/master/${prop.state.image.imageSrc}`} />
            <div>
                <p className="image-name-result">{`${prop.state.image.author}-${prop.state.image.name} (${prop.state.image.year})`}</p>
            </div>
            <div className>
                <button className="button button_colored" onClick={() => newGame(prop.state.gameData.slice(10))}>Continue</button>
                <button className="button button_bordered" onClick={() => showStatistic()}>Result</button>
            </div>
        </div>
    )
}