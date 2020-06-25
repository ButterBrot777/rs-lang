import React from "react";
import imgTrue from "../assets/icons8-pastel-100.png";
import imgFalse from "../assets/icons8-color-100.png";

export default class GameWordCompleted extends React.Component{
    commonWordClassName = 'text_inactiv';
    mainWordClassName = 'right__word';

render() {
    if(this.props.word === this.props.rightWord){this.commonWordClassName = 'right__word'}
    if(this.props.state.indexOfClick === this.props.index && this.props.answer === false) { this.mainWordClassName = 'text__inactiv__false'}
    return (
        <div key={this.props.id}>
            {
                (this.props.state.indexOfClick === this.props.index)?
                <p  className={this.mainWordClassName}>
                <Icon answer = {this.props.state.right} /> {`${this.props.word}`}
                </p>
                 :
                <p  className={this.commonWordClassName}>
                    {`${this.props.index + 1} ${this.props.word}`}
                </p>

            }
        </div>

    )
}
}
class Icon extends React.Component{
    render() {
        let imgPath =  (this.props.answer === true) ? imgTrue:imgFalse;
        return (
            <img className='icon' src={imgPath} />
        )
    }
}