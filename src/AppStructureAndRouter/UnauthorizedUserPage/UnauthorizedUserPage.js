import React, {Component} from 'react';
import {BrowserRouter as Router,Link} from "react-router-dom";


import './UnauthorizedUserPage.css'

class UnauthorizedUserPage extends Component{
  constructor(){
    super()
    this.state={
    }
  }
  render(){
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    return(
      <div className="unauthorized-page">
        <div className='unauthorized-page-inner'>
        <h3>You are not logged in</h3>
        <div className='unauthorized-page-btns'>
          <Link to="/Authorization"><button>Sign In</button></Link>
          <Link to="/Registration"><button>Sign Up</button></Link>
          <Link to="/"><button>Landing Page</button></Link>
        </div>
        </div>
      </div> 
    )
  }
}
export default UnauthorizedUserPage