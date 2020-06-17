import React, {Component} from "react";
import {BrowserRouter as Router,Switch,Route,Link} from "react-router-dom";

import './App.css'

import LogoutBtn from './HeaderBtns/LogoutBtn'
import LandingPage from './LandingPage/LandingPage'
import HomePage from './HomePage/HomePage'
import Statistics from '../AppStructureAndRouter/Statistics/Statistics'
import SingIn from './SingInPage/SingIn'
import SingUp from './SingUpPage/SingUp'

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
    userAuthorized: localStorage.getItem('token')
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
  const SingInAndSingUpBtns =
    <div>
       <Link to="/Registration"><button>Sing Up</button></Link>
       <Link to="/Authorization"><button>Sing In</button></Link>
    </div>
  return (
    <Router>
      <div className="landing-page">
      <header className='header'>
      <Link to="/"><h1>nykapi</h1></Link>
      {this.state.userAuthorized ? <LogoutBtn logOut={this.userLogOut}/> : SingInAndSingUpBtns}
      </header>
      <Switch>
        <Route exact path="/">
          <LandingPage />
        </Route>
        <Route path="/Registration">
          <LandingPage />
          <SingUp />
        </Route>
        <Route  path="/Authorization">
          <LandingPage />
          <SingIn />
        </Route>
        <Route path="/HomePage">
          <HomePage />
        </Route>
        <Route path="/Game1">
          <Game1 />
        </Route>
        <Route path="/Game2">
          <Game2 />
        </Route>
        <Route path="/Game3">
          <Game3 />
        </Route>
        <Route path="/Game4">
          <Game4 />
        </Route>
        <Route path="/Game5">
          <Game5 />
        </Route>
        <Route path="/Game6">
          <Game6 />
        </Route>
        <Route path="/Stat">
          <Statistics />
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

