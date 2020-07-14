import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Fade from 'react-reveal/Fade';

import './App.css';

import MyLandingPage from './LandingPage/LandingPage';
import LogoutBtn from './HeaderBtns/LogoutBtn';
import HomePage from './HomePage/HomePage';
import Statistics from '../AppStructureAndRouter/Statistics/Statistics';
import Dictionary from '../AppStructureAndRouter/Dictionary/dictionaryPage';
import Test from './BasicGame/Test';
import SignInAndSignUp from './SignInAndSignUp/SignInAndSignUp';

import UnauthorizedUserPage from './UnauthorizedUserPage/UnauthorizedUserPage';

import Game1 from './Game1/Game1';
import Game2 from './Game2/Game2';
import Game3 from './Game3/Game3';
import Game4 from './Game4/Game4';
import Game5 from './Game5/Game5';
import BasicGame from './BasicGame/BasicGame';

export default class App extends Component {
	constructor() {
		super();
		this.state = {
			userAuthorized: localStorage.getItem('token'),
			basicGameWords: 'combined',
			hardWordsTraining: false
		};
		this.userLogOut = this.userLogOut.bind(this);
	}

	handleWordsChoice = (value) => {
		this.setState({
			basicGameWords: value
		})
	}

	handlehardWordsTraining = () => {
		this.setState({
			hardWordsTraining: true
		})
	}

	disablehardWordsTraining = () => {
		this.setState({
		  hardWordsTraining: false
		})
	}

	userLogOut() {
		localStorage.setItem('token', '');
		this.setState({
			userAuthorized: localStorage.getItem('token'),
		});
	}

	render() {
		const SignInAndSignUpBtns = (
			<div className="header__buttons">
				<Link to="/Registration">
					<button className="button button_bordered">Sign Up</button>
				</Link>
				<Link to="/Authorization">
					<button className="button button_colored">Sign In</button>
				</Link>
			</div>
		);
		return (
			<Router>
				<div className="landing-page" >
					<div className="wrapper wrapper__header_colored">
						<div className="header__wrapper wrapper__inner">
							<header id="header" className="header">
								<Link to="/">
									<h1 className="logo">rs-lang-learn</h1>
								</Link>
								{this.state.userAuthorized ? <LogoutBtn logOut={this.userLogOut} /> : SignInAndSignUpBtns}
							</header>
						</div>
					</div>

					<Switch>
						<Route exact path="/">
							<MyLandingPage />
						</Route>
						<Route path="/Registration">
							<MyLandingPage />
							<SignInAndSignUp SignFlag={true} />
						</Route>
						<Route path="/Authorization">
							<MyLandingPage />
							<SignInAndSignUp SignFlag={false} />
						</Route>
						<Route path="/HomePage">
							{this.state.userAuthorized !== '' ? (
								<Fade right>
									<HomePage basicGameWords={this.state.basicGameWords}
										handleWordsChoice={this.handleWordsChoice}
										disablehardWordsTraining={this.disablehardWordsTraining}
										/>
								</Fade>
							) : (
									<UnauthorizedUserPage />
								)}
						</Route>
            <Route path="/BasicGame">
							{this.state.userAuthorized !== '' ? <BasicGame basicGameWords={this.state.basicGameWords}
							hardWordsTraining={this.state.hardWordsTraining}
							 /> : <UnauthorizedUserPage />}
						</Route>
						<Route path="/Game1">
							{this.state.userAuthorized !== '' ? <Game1 /> : <UnauthorizedUserPage />}
						</Route>
						<Route path="/Game2">
							{this.state.userAuthorized !== '' ? <Game2 /> : <UnauthorizedUserPage />}
						</Route>
						<Route path="/Game3">
							{this.state.userAuthorized !== '' ? (
								<Fade top opposite cascade collapse>
									{' '}
									<Game3 />
								</Fade>
							) : (
									<UnauthorizedUserPage />
								)}
						</Route>
						<Route path="/Game4">
							{this.state.userAuthorized !== '' ? <Game4 /> : <UnauthorizedUserPage />}
						</Route>
						<Route path="/Game5">
							{this.state.userAuthorized !== '' ? <Game5 /> : <UnauthorizedUserPage />}
						</Route>
						{/* <Route path="/Game6">
							{this.state.userAuthorized !== '' ? <Game6 /> : <UnauthorizedUserPage />}
						</Route> */}
						<Route path="/Stat">
							{this.state.userAuthorized !== '' ? <Statistics /> : <UnauthorizedUserPage />}
						</Route>
						<Route path="/Dictionary">
							{this.state.userAuthorized !== '' ? <Dictionary handlehardWordsTraining={this.handlehardWordsTraining} 
							hardWordsTraining={this.state.hardWordsTraining}/> : <UnauthorizedUserPage />}
						</Route>
						<Route path="/Test">
							{this.state.userAuthorized !== '' ? <Test /> : <UnauthorizedUserPage />}
						</Route>
					</Switch>
				</div>
			</Router>
		);
	}
}
