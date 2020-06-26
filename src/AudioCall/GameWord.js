import React from "react";
export default class Word extends React.Component{
    choseRight = () => {
        if(this.props.word === this.props.rightWord){
            this.props.completed(true,this.props.index)
        }else{
            this.props.completed(false,this.props.index)
        }
    };
    render() {
        return (
            <div key={this.props.id}>
            {
                <p  onClick={() => this.choseRight()}>
                    {`${this.props.index + 1} ${this.props.word}`}
                </p>
            }
            </div>

        )
    }
}

