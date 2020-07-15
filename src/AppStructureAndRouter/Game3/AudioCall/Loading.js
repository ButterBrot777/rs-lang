import React from "react";

export default class Loading extends React.Component{
    render() {
        return(
        <div className="lds-ring">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
        )
    }
}