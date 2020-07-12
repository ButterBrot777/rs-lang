import React, { Component } from 'react';
import { BrowserRouter as Router, Link, Redirect } from 'react-router-dom';
export default class StartSettings extends Component {

	handleSubmit = event => {
		event.preventDefault();
	};

<<<<<<< HEAD
	render() {
		return (
			<form onSubmit={this.handleSubmit} className="settings-container settings-inputs">
				<label>
					max words
					<input
						type="text"
						name="maxWordsPerDay"
						placeholder="max words"
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
						placeholder="new words"
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
				{this.props.redirect ?
					<Redirect from="/" to="/BasicGame" /> :
					<input
						type="button"
						value="Start Training"
						className="button button_bordered button-training "
						onClick={this.props.handleStartGame}
					/>
				}
=======
	inputCheck = event => {
		if (/^\d+$/.test(event.target.value)) {
			if (event.target.name === 'maxWordsPerDay') this.setState({ totalWordsPerDay: +event.target.value });
			if (event.target.name === 'newWordsPerDay') this.setState({ newWordsPerDay: +event.target.value });
		}
	};

	render() {
		return (
			<form onSubmit={this.handleSubmit} className="settings-container settings-inputs">
				<div className="form-button-container">
					<label>
						max words
						<input
							type="text"
							name="maxWordsPerDay"
							placeholder="words"
							autoFocus={true}
							autoComplete="off"
							value={this.state.totalWordsPerDay}
							onChange={event => this.inputCheck(event)}
							className="word-input_setting"
						></input>
					</label>
					<label>
						new words
						<input
							type="text"
							name="newWordsPerDay"
							autoComplete="off"
							value={this.state.newWordsPerDay}
							onChange={event => this.inputCheck(event)}
							className="word-input_setting"
						></input>
					</label>

					<label>
						words type
						<select value={this.state.value} onChange={this.handleChange}>
							<option value="new">new</option>
							<option value="learned">learned</option>
							<option value="combined">combined</option>
						</select>
					</label>
				</div>
				<input
					type="submit"
					value="Start Training"
					onClick={this.handleSubmit}
					className="button button_bordered button-training "
				/>
>>>>>>> develop
			</form>
		);
	}
}
