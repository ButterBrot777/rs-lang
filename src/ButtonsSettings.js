import React from 'react';
import './index.css';

class ButtonsSettings extends React.Component {
    render() {
        return (
            <div className="btns-container">
                <button className={this.props.settings.isTranslation ? "btn" : "btn opaque"} onClick={this.props.toggleTranslation}>перевод</button>
                <button className={this.props.settings.isMeaning ? "btn" : "btn opaque"} onClick={this.props.toggleMeaning}>значение</button>
                <button className={this.props.settings.isExample ? "btn" : "btn opaque"} onClick={this.props.toggleExample}>пример</button>
                <button className={this.props.settings.isTranscription ? "btn" : "btn opaque"} onClick={this.props.toggleTranscription}>транскрипция</button>
                <button className={this.props.settings.isImage ? "btn" : "btn opaque"} onClick={this.props.toggleImage}>картинка</button>
                <button className={this.props.settings.isSound ? "btn" : "btn opaque"} onClick={this.props.toggleSound}>звук</button>
            </div>
        )
    }
}

export default ButtonsSettings;