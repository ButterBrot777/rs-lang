import React, {useEffect} from "react";
import paintings1 from "./PathObjects/level1";
import {createUserWord, getUserWord, updateUserWord} from "../../ServerRequest/ServerRequests";

export default function EndScreen(prop) {


    useEffect(() => {
        sendStatistic()

        prop.state.statistic.trueWords.map((e) => handleUserWordUpdate("good", e.id));
        prop.state.statistic.falseWords.map((e) => handleUserWordUpdate("hard", e.id));
    },[])

    const easyInterval = 3;
    const goodInterval = 2;
    const hardInterval = 1;

    async function  handleUserWordUpdate(diffLevel, wordId){
        let word = await getUserWord(wordId);
        let lastTrain = +new Date();
        if (!word) {
            let interval = (diffLevel === 'good') ? goodInterval : hardInterval;
            let nextTrain;
            if (diffLevel === 'good') {
                nextTrain = new Date().setDate(new Date().getDate() + interval);
            } else {
                nextTrain = lastTrain;
            }
            let newWord = {
                "difficulty": diffLevel,
                "optional": {
                    "deleted": false,
                    "hardWord": false,
                    "repeatsStreak": 1,
                    "repeatsTotal": 1,
                    "addingDate": lastTrain,
                    lastTrain,
                    nextTrain
                }
            }


            createUserWord(wordId, newWord);
        } else {
            let interval;
            switch (word.difficulty) {
                case 'hard':
                    interval = word.optional.repeatsStreak * hardInterval;
                    break;
                case 'good':
                    interval = word.optional.repeatsStreak * goodInterval;
                    break;
                case 'easy':
                    interval = word.optional.repeatsStreak * easyInterval;
                    break;
                default:
                    interval = 0;
                    break;
            }
            let nextTrain;
            if (diffLevel === 'good') {
                nextTrain = new Date().setDate(new Date().getDate() + interval);
            } else {
                nextTrain = lastTrain;
            }

            let repeatsStreak = word.optional.repeatsStreak + 1;
            let repeatsTotal = word.optional.repeatsTotal + 1;
            let newWord = { ...word, optional: { ...word.optional, repeatsStreak, repeatsTotal, lastTrain, nextTrain } }
            delete newWord.id;
            delete newWord.wordId;
            updateUserWord(wordId, newWord);
        }
    }

    const userId = localStorage.getItem('userId');
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

        return content;
    };




    function newGame() {
        localStorage.setItem('imageCount', `${prop.state.imageCount + 1}`);
        prop.setState({
            ...prop.state,
            loading: true,
        })
        prop.newGame(userId)

    }


    return (
        <div className='end__screen__main'>
            <img src={`https://raw.githubusercontent.com/jules0802/rslang_data_paintings/master/${prop.state.image.imageSrc}`} />
            <div>
                <p className="image-name-result">{`${prop.state.image.author}-${prop.state.image.name} (${prop.state.image.year})`}</p>
            </div>
            <div>
                <button className="button button_colored" onClick={() => newGame()}>Continue</button>
                <button className="button button_bordered" onClick={() => showStatistic()}>Result</button>
            </div>
        </div>
    )
}