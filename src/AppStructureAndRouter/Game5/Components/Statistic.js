import React, {Component} from 'react';

class Statistic extends Component{
  constructor(){
    super()
    this.state={

    }
  }
  render(){
    return(
      <div>
        {console.log(this.props.true, this.props.false)}
        Статистика
      </div>
    )
  }
}
export default Statistic