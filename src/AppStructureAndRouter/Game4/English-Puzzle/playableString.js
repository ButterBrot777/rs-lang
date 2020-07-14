import React, {useContext} from "react";
import Context from "./context";
import paintings1 from "./PathObjects/level1";

export default function PlayableString(prop) {
    const gameContext = useContext(Context)

    function addWord() {
        let current = gameContext.gameState.indexOfPlayWord
        let chosenWords = gameContext.gameState.chosenWords;
        let currentString = gameContext.gameState.currentString;
        let check = false;


        chosenWords[current] = gameContext.gameState.currentString[prop.index]
        if (chosenWords.indexOf('') === -1 && chosenWords.length !== 0) {
            check = true
        }
        currentString[prop.index] = '';
        currentString[prop.index] = '';
        gameContext.setGameState({
            ...gameContext.gameState,
            chosenWords: chosenWords,
            indexOfPlayWord: ++current,
            needToCheck: check
        })
    }

    let index = 0;

    if (localStorage.getItem('flag') === null || localStorage.getItem('flag') === 'false') {
        localStorage.setItem('flag', 'true')
        index = gameContext.gameState.currentStr.lastIndexOf(prop.word);
    } else if (localStorage.getItem('flag') === 'true') {
        localStorage.setItem('flag', 'false')

        index = gameContext.gameState.currentStr.indexOf(prop.word);
    }


    let width =
        (100 / gameContext.gameState.length) * gameContext.gameState.lengthArray[gameContext.gameState.strExample.indexOf(prop.word)]
    let leftVal = gameContext.gameState.lengthArrayCurrent
        .slice(0, index)
        .map((e) => (100 / gameContext.gameState.length) * e)
        .reduce((acc, current) => acc + current, 0)
    const blockHeight = 70;
    const topVal = blockHeight * gameContext.gameState.stringCount;
    // word.style.backgroundPosition = `top -${topVal}px left -${leftVal}px`;


    const style = {
        div: {
            backgroundPosition: `top -${topVal}px left -${leftVal * 8}px`,
            width: `${width * 8}px`,
            backgroundImage: `url(https://raw.githubusercontent.com/jules0802/rslang_data_paintings/master/${paintings1[gameContext.gameState.imageCount].imageSrc})`,
        },
        styleNone: {
            width: `${width * 8}px`,
        }
    };
    let styling = '';
    if (prop.word !== '' && gameContext.gameState.settings.picture === true) {
        styling = style.div
    } else {
        styling = style.styleNone
    }
    return (
        <div className="game__word" style={styling}
             onClick={((prop.canClicked && prop.word !== '') ? () => addWord() : () => null)}>
            <p>
                {prop.word.replace('</b>', '').replace('<b>', '')}
            </p>
        </div>
    )
}