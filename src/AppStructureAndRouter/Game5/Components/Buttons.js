import React, {Component} from 'react';

class Buttons extends Component{
  constructor(props){
    super(props)
    this.state={
    }
    // this.shuffleWordsBtns = this.shuffleWordsBtns.bind(this)
  // this.getSameWords = this.getSameWords.bind(this)
  }
  componentWillMount(){
    // fetch(`https://dictionary.skyeng.ru/api/public/v1/words/search?search=${this.props.word}`)
    // .then(res =>  res.json())
    // .then(data => {
    //   // let obj=[ 
    //   //   data[0].meanings[0].translation.text,
    //   //   data[1].meanings[0].translation.text, 
    //   //   data[2].meanings[0].translation.text,
    //   //   data[3].meanings[0].translation.text, 
    //   //   data[4].meanings[0].translation.text
    //   // ]
    //   console.log(data)
    // })
  }
  componentDidMount(){
    // fetch(`https://dictionary.skyeng.ru/api/public/v1/words/search?search=${this.props.word}`)
    // .then(res =>  res.json())
    // .then(data => {   
    //   console.log(data)
    // })
  }
 
  render(){
    return(
      <div>
        
        {console.log(this.props.words)}
        <button onClick={(word) => this.props.nextWord(this.props.words[0])}>{this.props.words[0]}</button>
        <button onClick={(word) => this.props.nextWord(this.props.words[1])}>{this.props.words[1]}</button>
        <button onClick={(word) => this.props.nextWord(this.props.words[2])}>{this.props.words[2]}</button>
        <button onClick={(word) => this.props.nextWord(this.props.words[3])}>{this.props.words[3]}</button>
        <button onClick={(word) => this.props.nextWord(this.props.words[4])}>{this.props.words[4]}</button>
      </div>
    )
  }
}
export default Buttons