import React, { Component } from 'react';
import { BrowserRouter as Router, Link } from "react-router-dom";

class ScoreStatistic extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
        this.MathScore = this.MathScore.bind(this); 
        this.localStor = this.localStor.bind(this); 
        
    }
    cash=localStorage.getItem("cash");
    lastScore= localStorage.getItem("LastScoreSprint");
    componentDidMount(){
        this.MathScore()
        this.localStor();
    }
    localStor(){
        localStorage.setItem("cash", this.lastScore);
        localStorage.setItem("LastScoreSprint", this.props.tekscore);
    }
    MathScore(){
    this.cash= this.lastScore;
    this.lastScore= this.props.tekscore;
    return 1;
    }
 render() { 
     if(!this.props.tekscore){
        return (<div></div>)
     }
     else if(this.cash){
        return (
            <p className="errors">You Last Score: {this.cash} Your Score: {this.props.tekscore}</p>
        ) 
     }
     else {
        return (
        <p className="errors">Your Score: {this.props.tekscore}</p>
        )
     }
        
    }  
} 
    export default ScoreStatistic