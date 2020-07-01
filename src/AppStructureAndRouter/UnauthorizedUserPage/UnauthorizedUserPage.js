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
        <h3>Авторизируйтесь, что бы посетить данную страницу</h3>
        <div className='unauthorized-page-btns'>
          <Link to="/Authorization"><button>Sign In</button></Link>
          <Link to="/Registration"><button>Sign Up</button></Link>
          <Link to="/"><button>Landing Page</button></Link>
        </div>
      </div> 
    )
  }
}
export default UnauthorizedUserPage