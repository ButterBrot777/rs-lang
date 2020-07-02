import React, {Component} from "react";
import {BrowserRouter as Router,Switch,Route,Link} from "react-router-dom";
import Fade from 'react-reveal/Fade';

import './App.css'

import LogoutBtn from './HeaderBtns/LogoutBtn'
import LandingPage from './LandingPage/LandingPage'
import HomePage from './HomePage/HomePage'
import Statistics from '../AppStructureAndRouter/Statistics/Statistics'
import SignInAndSignUp from './SignInAndSignUp/SignInAndSignUp'

import UnauthorizedUserPage from './UnauthorizedUserPage/UnauthorizedUserPage'

import Game1 from './Game1/Game1'
import Game2 from './Game2/Game2'
import Game3 from './Game3/Game3'
import Game4 from './Game4/Game4'
import Game5 from './Game5/Game5'
import Game6 from './Game6/Game6'

export default class App extends Component {
constructor(){
  super()
  this.state={
    userAuthorized: localStorage.getItem('token') || '123'
  }

  this.userLogOut = this.userLogOut.bind(this)
}

 userLogOut(){
  localStorage.setItem('token', '')
  this.setState({
     userAuthorized: localStorage.getItem('token')
   })
 }

render(){
  const SignInAndSignUpBtns =
    <div>
       <Link to="/Registration"><button>Sign Up</button></Link>
       <Link to="/Authorization"><button>Sign In</button></Link>
    </div>
    
  return (
    <Router>
      <div className="landing-page" tabIndex={0} onKeyDown={(e)=>console.log(e.keyCode)}>
      <header className='header'>
      <Link to="/"><h1>nykapi</h1></Link>
      {this.state.userAuthorized ? <LogoutBtn logOut={this.userLogOut}/> : SignInAndSignUpBtns}
      </header>
      <Switch>
        <Route exact path="/">
          <LandingPage />
        </Route>
        <Route path="/Registration">
          <LandingPage />
          <SignInAndSignUp SignFlag={true}/>
        </Route>
        <Route  path="/Authorization">
        <LandingPage />
          <SignInAndSignUp SignFlag={false}/>
        </Route>
        <Route path="/HomePage">
        {this.state.userAuthorized !== '' ? <Fade right ><HomePage /></Fade> : <UnauthorizedUserPage />}
        </Route>
        <Route path="/Game1">
        {this.state.userAuthorized !== '' ? <Game1 /> : <UnauthorizedUserPage />}
        </Route>
        <Route path="/Game2">
        {this.state.userAuthorized !== '' ? <Game2 /> : <UnauthorizedUserPage />}
        </Route>
        <Route path="/Game3">
        {this.state.userAuthorized !== '' ? <Fade top opposite cascade collapse> <Game3 /></Fade> : <UnauthorizedUserPage />}
        </Route>
        <Route path="/Game4">
        {this.state.userAuthorized !== '' ? <Game4 /> : <UnauthorizedUserPage />}
        </Route>
        <Route path="/Game5">
        {this.state.userAuthorized !== '' ? <Game5 /> : <UnauthorizedUserPage />}
        </Route>
        <Route path="/Game6">
        {this.state.userAuthorized !== '' ? <Game6 /> : <UnauthorizedUserPage />}
        </Route>
        <Route path="/Stat">
        {this.state.userAuthorized !== '' ? <Statistics /> : <UnauthorizedUserPage />}
        </Route>
        </Switch>
      <footer className='footer'>
        <h2>footer</h2>
      </footer>    
      </div> 
    </Router>
  );
}
}

