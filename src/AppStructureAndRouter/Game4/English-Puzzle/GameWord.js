import React, {useContext} from "react";
import Context from "./context";
import paintings1 from "./PathObjects/level1";

function GameWord(prop) {
    const gameContext = useContext(Context)
    let styleName = 'game__text';
    if (gameContext.gameState.checkedWords.length !== 0 && prop.needStyle) {
        styleName = gameContext.gameState.checkedWords[prop.index] ? 'true__word' : 'false__word';
    }

    function removeWord() {

        let chosenWords = gameContext.gameState.chosenWords;
        let currentString = gameContext.gameState.currentString;
        let str = gameContext.gameState.strExample;
        let index = str.indexOf(prop.word);

        chosenWords.splice(chosenWords.indexOf(prop.word), 1);
        chosenWords.push('');
        let empty = chosenWords.indexOf('');
        currentString[index] = prop.word;
        gameContext.setGameState({
            ...gameContext.gameState,
            chosenWords: chosenWords,
            indexOfPlayWord: empty,
            needToCheck: false,
            checkedWords: [],
        })
    }

    let width = 0;
    let leftVal = 0;
    if (prop.strIndex !== gameContext.gameState.stringCount && gameContext.gameState.stringCount !== 0) {

        width =
            (100 / gameContext.gameState.lastStrings[prop.strIndex].length) * gameContext.gameState.lengthArray[gameContext.gameState.strExample.indexOf(prop.word)];

        leftVal = gameContext.gameState.lastStrings[prop.strIndex].lengthArrayCurrent
            .slice(0, gameContext.gameState.lastStrings[prop.strIndex].currentStr.indexOf(prop.word))
            .map((e) => (100 / gameContext.gameState.lastStrings[prop.strIndex].length) * e)
            .reduce((acc, current) => acc + current, 0)
    } else {
        let index = 0;
        if (gameContext.gameState.currentStr.indexOf(prop.word) === gameContext.gameState.currentStr.lastIndexOf(prop.word)) {
            index = gameContext.gameState.currentStr.indexOf(prop.word);
        } else {
            if (localStorage.getItem('flag') === null || localStorage.getItem('flag') === 'false') {
                localStorage.setItem('flag', 'true')
                index = gameContext.gameState.currentStr.lastIndexOf(prop.word);
            } else if (localStorage.getItem('flag') === 'true') {
                localStorage.setItem('flag', 'false')

                index = gameContext.gameState.currentStr.indexOf(prop.word);
            }

        }
        width =
            (100 / gameContext.gameState.length) * gameContext.gameState.lengthArray[gameContext.gameState.strExample.indexOf(prop.word)]
        leftVal = gameContext.gameState.lengthArrayCurrent
            .slice(0, index)
            .map((e) => (100 / gameContext.gameState.length) * e)
            .reduce((acc, current) => acc + current, 0)

    }


    const blockHeight = 70;
    const topVal = blockHeight * prop.strIndex;


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
    if (prop.word !== '' && prop.state.settings.picture === true) {
        styling = style.div
    } else {
        styling = style.styleNone
    }

    return (
        <div className='game__word' style={styling}
             onClick={((prop.state.completed === false && prop.word !== '') ? () => removeWord() : () => null)}>
            <p className={styleName}>
                {prop.word.replace('</b>', '').replace('<b>', '')}
            </p>
        </div>
    )
}

export default GameWord