import React, {Component} from 'react';

class Buttons extends Component{
  constructor(props){
    super(props)
    this.state={
  
    }
    // this.shuffleWordsBtns = this.shuffleWordsBtns.bind(this)
  // this.getSameWords = this.getSameWords.bind(this)
  }

 
  // componentWillMount(){
  //   this.shuffleWordsBtns()
  // }
  //  componentDidMount(){
  //   this.shuffleWordsBtns()
  // }
  // getSameWords(){
  //   fetch(`https://dictionary.skyeng.ru/api/public/v1/words/search?search=${this.props.word}`)
  //     .then(res =>  res.json())
  //     .then(data=> console.log(data))
  // }
 
  render(){
    return(
      <div>
        {console.log(this.props.words)}
        <button onClick={this.props.nextWord}>{this.props.words[0]}</button>
        <button onClick={this.props.nextWord}>{this.props.words[1]}</button>
        <button onClick={this.props.nextWord}>{this.props.words[2]}</button>
        <button onClick={this.props.nextWord}>{this.props.words[3]}</button>
        <button onClick={this.props.nextWord}>{this.props.words[4]}</button>
      </div>
    )
  }
}
export default Buttons