import React, { Component } from 'react';
// import { BrowserRouter as Router, Link, Redirect } from 'react-router-dom';
import { Route, Redirect, Link } from 'react-router-dom';
export default class StartSettings extends Component {
	
	handleSubmit = event => {
		event.preventDefault();
	};

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
						value={this.props.maxWordsPerDay}
						onChange={(event) => this.props.inputCheck(event)}
						className="word-input_setting"
					></input>
				</label>
				<label>
					new words
					<input
						type="text"
						name="wordsPerDay"
						autoComplete="off"
						value={this.props.wordsPerDay}
						onChange={(event) => this.props.inputCheck(event)}
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
				{/* <Link to="/BasicGame"> */}
					{
					this.props.redirect ?
						<Redirect from="/" to="/BasicGame" /> :
					<input
						type="button"
						value="Start Training"
						className="button button_bordered button-training "
						onClick={this.props.handleStartGame}
					/>
				// </ Link >
					}
			</form>
		);
	}
}
