import React, { Component } from 'react';
import { getSettingsUser, addSettingsUser } from '../ServerRequest/ServerRequests';
import { BrowserRouter as Router, Link } from 'react-router-dom';
export default class StartSettings extends Component {
	constructor(props) {
		super(props);
		this.state = {
			maxWordsPerDay: 0,
			wordsPerDay: 0,
			level: 0,
			
		};
	}

	componentDidMount = async () => {
		let { wordsPerDay, optional: { maxWordsPerDay, level, page, wordsLearntPerPage, hints } } = await getSettingsUser();
		this.setState({
			maxWordsPerDay,
			wordsPerDay,
			level,
			page,
			wordsLearntPerPage,
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

	componentDidUpdate = (prevState) => {
		if (this.state.wordsPerDay !== prevState.wordsPerDay
			|| this.state.maxWordsPerDay !== prevState.maxWordsPerDay) {
			this.handleSettingsUpdate();
		}
	}

	handleSubmit = event => {
		event.preventDefault();
	};

	inputCheck = (event) => {
		if (/^\d+$/.test(event.target.value) || event.target.value === '') {
			const target = event.target;
			const value = target.name === 'maxWordsPerDay' ? target.value : target.value;
			const name = target.name;
			this.setState({
				[name]: value
			})
		}
	}

	handleSettingsUpdate = () => {
		let { wordsPerDay, page, level, wordsLearntPerPage, maxWordsPerDay, hints } = this.state;
		if (wordsPerDay > 0 && maxWordsPerDay > 0) {
			let newSettings = {
				"wordsPerDay": wordsPerDay,
				"optional": {
					"maxWordsPerDay": maxWordsPerDay,
					"level": level,
					"page": page,
					"wordsLearntPerPage": wordsLearntPerPage,
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
	}

	render() {
		return (
			<form onSubmit={this.handleSubmit} className="settings-container settings-inputs">
				<label>
					max words
					<input
						type="text"
						name="maxWordsPerDay"
						placeholder="words"
						autoFocus={true}
						autoComplete="off"
						value={this.state.maxWordsPerDay}
						onChange={(event) => this.inputCheck(event)}
						className="word-input_setting"
					></input>
				</label>
				<label>
					new words
					<input
						type="text"
						name="wordsPerDay"
						autoComplete="off"
						value={this.state.wordsPerDay}
						onChange={(event) => this.inputCheck(event)}
						className="word-input_setting"
					></input>
				</label>

				<label>
					words type
					<select value={this.props.basicGameWords}
						onChange={(e) => this.props.handleWordsChoice(e.target.value)}>
						<option value="new">new</option>
						<option value="learned">learned</option>
						<option value="combined">combined</option>
					</select>
				</label>
				<Link to="/BasicGame">
					<input
						type="button"
						value="Start Training"
						className="button button_bordered button-training "
					/>
				</Link>
			</form>
		);
	}
}
