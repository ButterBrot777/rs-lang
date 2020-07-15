import React, { Component } from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import FlavorForm from './InputSelect';
import 'materialize-css';
import { Dropdown, Button } from 'react-materialize';
import { getSettingsUser, addSettingsUser } from '../ServerRequest/ServerRequests';

import './HomePage.scss';
import '../BasicGame/BasicGame.css'

import StartSettings from './InputSelect';

class HomePage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			maxWordsPerDay: '',
			wordsPerDay: '',
			redirect: false,
			isModalWindow: false
		};
	}

	componentDidMount = async () => {
		let settings = await getSettingsUser();
		if (!settings) {
			let date = new Date()
			date.setDate(date.getDate() - 1);
			let yesterday = date.toLocaleDateString();
			settings = {
				"wordsPerDay": 20,
				"optional": {
					"maxWordsPerDay": 40,
					"level": 0,
					"page": 0,
					"wordsLearntPerPage": 0,
					"lastTrain": yesterday,
					"hints": {
						"meaningHint": true,
						"translationHint": true,
						"exampleHint": true,
						"soundHint": false,
						"imageHint": false,
						"transcriptionHint": false
					}
				}
			}
		}
		let { wordsPerDay, optional: { maxWordsPerDay, level, page,
			wordsLearntPerPage, hints, lastTrain } } = settings;
		this.setState({
			maxWordsPerDay,
			wordsPerDay,
			level,
			page,
			wordsLearntPerPage,
			lastTrain,
			hints: {
				meaningHint: hints.meaningHint,
				translationHint: hints.translationHint,
				imageHint: hints.imageHint,
				transcriptionHint: hints.transcriptionHint,
				exampleHint: hints.exampleHint,
				soundHint: hints.soundHint,
			}
		})
	}

	inputCheck = (event) => {
		if (/^\d+$/.test(event.target.value) || event.target.value === '') {
			const target = event.target;
			const value = target.name === 'maxWordsPerDay' ? target.value : target.value;
			const name = target.name;
			this.setState({
				[name]: +value
			})
		}
	}

	handleSettingsUpdate = () => {
		let { lastTrain, wordsPerDay, page, level,
			wordsLearntPerPage, maxWordsPerDay, hints } = this.state;
		let newSettings = {
			"wordsPerDay": wordsPerDay,
			"optional": {
				"maxWordsPerDay": maxWordsPerDay,
				"level": level,
				"page": page,
				"wordsLearntPerPage": wordsLearntPerPage,
				"lastTrain": lastTrain,
				"hints": {
					"meaningHint": hints.meaningHint,
					"translationHint": hints.translationHint,
					"exampleHint": hints.exampleHint,
					"soundHint": hints.soundHint,
					"imageHint": hints.imageHint,
					"transcriptionHint": hints.transcriptionHint
				},
			}
		};
		addSettingsUser(newSettings);
	}

	handleStartGame = () => {
		if (this.state.wordsPerDay > 0 && this.state.maxWordsPerDay > 0) {
			this.props.disablehardWordsTraining();
			this.handleSettingsUpdate();
			let date = new Date();
			let today = date.toLocaleDateString();
			if (this.state.lastTrain === today) {
				this.setState({
					isModalWindow: true
				});
			} else {
				this.setState({
					redirect: true,
				});
			}
		} else {
			alert('The number of words should be more than 0')
		}
	}

	closeModal = () => {
		this.setState({
			isModalWindow: false
		})
	}

	render() {
		return (
			<div className="wrapper__home-page">
				{this.state.isModalWindow && (
					<div className="game-end">
						<button className="btn" onClick={this.closeModal}>Close</button>
						<h2 className="game-end__title">Hurrah, that's it for today!</h2>
						<div className="game-end__text">You have more new cards but you exceeded the limit for
						today. You can continue your training but please keep in mind you will have more words to repeat.</div>
						<Link className="btn" to="/BasicGame">Play More</Link>
					</div>
				)}
				<div className="wrapper__inner">
					<div className="home-page">
						<div className="start-menu">
							<h2 className="start-menu__logo">Choose Settings:</h2>
							<StartSettings
								basicGameWords={this.props.basicGameWords} handleWordsChoice={this.props.handleWordsChoice}
								redirect={this.state.redirect} handleStartGame={this.handleStartGame}
								inputCheck={this.inputCheck} handleSettingsUpdate={this.handleSettingsUpdate}
								maxWordsPerDay={this.state.maxWordsPerDay} wordsPerDay={this.state.wordsPerDay}
							/>
						</div>
						<div className="start-menu">
							<h2 className="user-info__title">User Info:</h2>

							<Link to="/Stat">
								<span className="button button-settings_bordered">Statistic</span>
							</Link>
							<Link to="/Dictionary">
								<span className="button button-settings_bordered">Dictionary</span>
							</Link>
							<Link to="/Test">
								<span className="button button-settings_bordered">Test</span>
							</Link>
						</div>
						<div className="start-menu">
							<ul className="mini-games">
								<li>
									<Link to="/Game1" className="button button_bordered button-game">
										SPEACKIT
									</Link>
								</li>
								<li>
									<Link to="/Game2" className="button button_bordered button-game">
										SPRINT
									</Link>
								</li>
								<li>
									<Link to="/Game3" className="button button_bordered button-game">
										AUDIO CALL
									</Link>
								</li>
								<li>
									<Link to="/Game4" className="button button_bordered button-game">
										ENGLISH PUZZLE
									</Link>
								</li>
								<li>
									<Link to="/Game5" className="button button_bordered button-game">
										SAWANNAH
									</Link>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
export default HomePage;