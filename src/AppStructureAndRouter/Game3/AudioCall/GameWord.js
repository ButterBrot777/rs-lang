import React from "react";
export default class Word extends React.Component{
    choseRight = () => {
        if(this.props.word === this.props.state.obj.wordTranslate){
            this.props.completed(true,this.props.index)
            console.log('herrrrrrrrrrrrro')
        }else{
            this.props.completed(false,this.props.index)
        }
    };

    choseWordWithkeys = (event) => {
        if(event.keyCode === 13 && this.props.state.focusIndex === this.props.index){
            this.choseRight()
        }
    };

    componentDidMount() {
        document.addEventListener('keyup',this.choseWordWithkeys)
    }
    componentWillUnmount() {
        document.removeEventListener('keyup',this.choseWordWithkeys)
    }

    render() {
        return (
            <div className={'game__word__container'} >
            {
                <p  onClick={() => this.choseRight()} className={(this.props.index === this.props.state.focusIndex) ?'word__focused':'common__word'} >
                    {`${this.props.index + 1} ${this.props.word}`}
                </p>
            }
            </div>

        )
    }
}


