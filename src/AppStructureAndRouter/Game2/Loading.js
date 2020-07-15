
import React, { Component } from 'react';
import './LoadingWindow.css'
class Loading extends Component {

  constructor(props) {
    super(props)
    this.state = {
    };
  }
  render() {
    return (
      <div className='cssload-loader'>
        <div className='cssload-inner cssload-one'></div>
        <div className='cssload-inner cssload-two'></div>
        <div className='cssload-inner cssload-three'></div>
      </div>
    )
  }
}
export default Loading