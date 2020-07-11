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
           <div>
               <div>
                   <button className={prop.state.settings.soundButton? 'button__active':'button'} onClick={() => showSound()}>Слушать пол</button>
                   <button className={prop.state.settings.translation  ? 'button__active':'button'} onClick={() => showTranslation()}>Перевод</button>
                   <button className={prop.state.settings.autoSound ? 'button__active':'button'} onClick={() => autoSound()}>Слушать</button>
                   <button className={prop.state.settings.picture ? 'button__active':'button'} onClick={() => showBg()}>показать картинку</button>
               </div>
           </div>
       )
}