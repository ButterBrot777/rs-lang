import React from "react";
export  default function GameHeader(prop) {
       function showTranslation(){
           localStorage.setItem('translation',`${!prop.state.settings.translation}`);
           prop.setState({
               ...prop.state,
               settings:{
                   ...prop.state.settings,
                   translation: !prop.state.settings.translation,
               },
           })
       }

       function showSound() {
           localStorage.setItem('soundButton', `${!prop.state.settings.soundButton}`);
           prop.setState({
               ...prop.state,
               settings:{
                   ...prop.state.settings,
                   soundButton: !prop.state.settings.soundButton,
               },
           })
       }
        function autoSound() {
            localStorage.setItem('autoSound',`${!prop.state.settings.autoSound}`)
            prop.setState({
                ...prop.state,
                settings:{
                    ...prop.state.settings,
                    autoSound: !prop.state.settings.autoSound,
                },
            })
        }
        function showBg() {
            localStorage.setItem('picture', `${!prop.state.settings.picture}`)
            prop.setState({
                ...prop.state,
                settings:{
                    ...prop.state.settings,
                    picture: !prop.state.settings.picture,
                },
            })
        }

       return (
           <div className={'english__header'}>
               <div className={'english__header__button__container'}>
                   <button className={prop.state.settings.soundButton? 'button__active':'header__button__english'} onClick={() => showSound()}>Слушать пол</button>
                   <button className={prop.state.settings.translation  ? 'button__active':'header__button__english'} onClick={() => showTranslation()}>Перевод</button>
                   <button className={prop.state.settings.autoSound ? 'button__active':'header__button__english'} onClick={() => autoSound()}>Слушать</button>
                   <button className={prop.state.settings.picture ? 'button__active':'header__button__english'} onClick={() => showBg()}>показать картинку</button>
               </div>
           </div>
       )
}