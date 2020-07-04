import React, { Component } from 'react';

export default class StartSettings extends Component {
	constructor(props) {
		super(props);
		this.state = {
			value: 'combined',
			totalWordsPerDay: 40,
			newWordsPerDay: 20,
		};
	}

	handleChange = event => {
		this.setState({ value: event.target.value });
	};

	handleSubmit = event => {
		alert(
			'Your choice is: \n' +
				this.state.value +
				'\n' +
				this.state.totalWordsPerDay +
				'\n' +
				this.state.newWordsPerDay
		);
		event.preventDefault();
	};

  inputCheck = (event) => {
    console.log(event.target.name)
    if(/^\d+$/.test(event.target.value)) {
      if(event.target.name === 'maxWordsPerDay') this.setState({ totalWordsPerDay: +event.target.value })
      if(event.target.name === 'newWordsPerDay') this.setState({ newWordsPerDay: +event.target.value })
    } else {
      alert('Please put a number')
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
						value={this.state.totalWordsPerDay}
						onChange={(event) => this.inputCheck(event)}
						className="word-input_setting"
					></input>
				</label>
				<label>
					new words
					<input
						type="text"
						name="newWordsPerDay"
						value={this.state.newWordsPerDay}
						onChange={(event) => this.inputCheck(event)}
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
				<input
					type="submit"
					value="Start Training"
					onClick={this.handleSubmit}
					className="button button_bordered button-training "
				/>
			</form>
		);
	}
}
