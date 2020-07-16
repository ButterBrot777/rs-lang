import React, {
  Component
} from 'react';
import StrikDiv from './StrikDiv';
import MathScore from './MathScore';
import Statistic from '../SmallStatistic/SmallStatistic'
import {
  BrowserRouter as Router,
  Link
} from "react-router-dom";
class RenderWords extends Component {
  constructor(props) {
    super(props)
    this.state = {
      score: 0,
      strik: 0,
      smile: "",
      translateword: "",
      oneScore: 10,
      word: "",
      trueWord: 0,
      finishGame: "hidden",
      data: this.props.dataWords,//////
      selectWord: {},
      strokeDasharray: `50 10`,
      strokeDashoffset: 100,
    };
    this.initFn = this.initFn.bind(this);
  }
  dataArray = this.props.dataWords;
  trueAnswer = [];
  falseAnswer = [];
  timer = 60;
  radius = 42;
  circumference = 2 * Math.PI * this.radius;
  trueSmile = "5px solid green";
  falseSmile = "5px solid red";

  setProgress(percent) {
    const offset = (this.circumference - percent / 60 * this.circumference);
    this.setState({ strokeDashoffset: offset });
  }
  // ==========================================================

  async generateWord() {
    let randomFirstWordIndex = Math.floor(Math.random() * Math.floor(this.dataArray.length));
    let randomSecondWordIndex = Math.floor(Math.random() * Math.floor(this.state.data.length));
    let indexRandomTranslateWord = Math.floor(Math.random() * Math.floor(2));
    let word;
    let wordTranslate;
    word = this.dataArray[randomFirstWordIndex].word;
    if (indexRandomTranslateWord) {
      wordTranslate = this.state.data[randomFirstWordIndex].wordTranslate;
    } else {
      wordTranslate = this.state.data[randomSecondWordIndex].wordTranslate;
    }
    this.setState({
      word: word,
      translateword: wordTranslate,
      trueWord: indexRandomTranslateWord,
      selectWord: this.dataArray[randomFirstWordIndex]
    })
    this.dataArray.splice(randomFirstWordIndex, 1);
  }
  // ==========================================================
  componentDidMount() {
    this.timer = 60;
    this.initFn();
  }
  // ==========================================================
  onKeyUp = (event) => {
    if (event.keyCode === 39) this.trueWord();
    else if (event.keyCode === 37) this.falseWord();
  };
  componentWillUnmount() {
    this.timer = 0;
  }
  // ==========================================================
  initFn() {
    let procentTimer;
    if (this.timer === 60) {
      procentTimer = 59;
      this.setState({ strokeDasharray: `${this.circumference} ${this.circumference}` });
      this.setState({ strokeDashoffset: this.circumference });
      this.setTimer(procentTimer);
    }
    if (this.dataArray.length === 0) {
      localStorage.setItem("lastScore", this.state.score);
      this.setState({
        finishGame: "",
        score: 0
      });
      document.removeEventListener('keyup', this.onKeyUp);

    } else {
      this.setState({
        finishGame: "hidden"
      });

      this.generateWord();
      document.addEventListener('keyup', this.onKeyUp);
    }
  }
  // ==========================================================
  trueWord() {
    if (this.state.trueWord) {
      this.setState(MathScore(this.state.score, this.state.strik + 1));
      this.setState({
        smile: this.trueSmile
      });
      this.trueAnswer.push(this.state.selectWord);
    } else {
      this.setState(MathScore(this.state.score, 0));
      this.setState({
        smile: this.falseSmile
      });
      this.falseAnswer.push(this.state.selectWord);
    }
    this.setSmileTimeout();
    this.initFn();
  }
  // // ==========================================================
  falseWord() {
    if (!this.state.trueWord) {
      this.setState(MathScore(this.state.score, this.state.strik + 1));
      this.setState({
        smile: this.trueSmile
      });
      this.trueAnswer.push(this.state.selectWord);
    } else {
      this.setState(MathScore(this.state.score, 0));
      this.setState({
        smile: this.falseSmile
      });
      this.falseAnswer.push(this.state.selectWord);
    }
    this.setSmileTimeout();
    this.initFn();
  }
  // ==========================================================
  delaySmile() {
    this.setState({
      smile: ""
    });
  }
  async setSmileTimeout() {
    setTimeout(() => this.delaySmile(), 500);
  }
  // ==========================================================
  timerFn(procentTimer) {
    if (this.timer < 1) {
      localStorage.setItem("lastScore", this.state.score);
      this.dataArray.forEach(element => {
        this.falseAnswer.push(element)
      });
      this.setState({
        finishGame: "",
        score: 0
      });
      document.removeEventListener('keyup', this.onKeyUp);
    } else {
      this.timer -= 1;

      this.setProgress(procentTimer)
      procentTimer -= 1;
      this.setTimer(procentTimer);
    }
  }
  setTimer(procentTimer) {
    setTimeout(() => this.timerFn(procentTimer), 1000);
  }
  // ==========================================================
  render() {
    if (!this.state.finishGame) {
      return <Statistic true={this.trueAnswer} false={this.falseAnswer} homePageGame={this.props.defaultLevel}
        newPage={this.props.pageSprint} newLevel={this.props.levelSprint} totalGame={this.props.chooseGame} nameGame={"sprint"} tekScore={localStorage.getItem("lastScore")} />
    } else {
      return (
        <div className="sprint-game" >
          <div className="sprint-game-content">
            <div className="sprint-all-block">
              <div className="score-word-buttons" style={{ outline: this.state.smile }}>
                <div className="sprint-score">
                  <p style={{ color: "#fbc97e", fontSize: "30px" }}>{this.state.oneScore} очков за слово</p>
                  <h2 style={{ color: "#fbc97e" }}>{this.state.score}</h2>
                  <div className="strik-circule">
                    <StrikDiv strikdiv={this.state.strik} />
                  </div>
                </div>
                <div className="word-buttons">
                  <div className="word">
                    <p style={{ color: "#fbc97e", fontSize: "30px" }}>{this.state.word}</p>
                    <p style={{ color: "#fbc97e", fontSize: "30px" }}>{this.state.translateword}</p>
                  </div>
                  <div className="flex-button">
                    <div className='sprint-false-btn'>
                      <button onClick={() => this.falseWord()}>False</button>
                    </div>
                    <div className='sprint-true-btn'>
                      <button onClick={() => this.trueWord()}>True</button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="sprint-timer">
                <svg className="progress-ring" width="120" height="120">
                  <text style={{ backgroundColor: "#fbc97e", color: "#fbc97e" }} x="35%" y="55%" >{this.timer} </text>
                  <circle strokeDasharray={this.state.strokeDasharray} strokeDashoffset={this.state.strokeDashoffset}
                    stroke="#fbc97e" strokeWidth="4" cx="60" cy="60" r="42" fill="transparent" transformorigin="center"
                    transition="strokeDashoffset 0.3s" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }
}


export default RenderWords