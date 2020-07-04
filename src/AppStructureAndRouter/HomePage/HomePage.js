import React, { Component } from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import FlavorForm from './InputSelect';
import 'materialize-css';
import { Dropdown, Button } from 'react-materialize';

import './HomePage.scss';
import StartSettings from './InputSelect';

class HomePage extends Component {
	render() {
		return (
			<div className="wrapper__home-page">
				<div className="wrapper__inner">
					<div className="home-page">
						<div className="start-menu">
							<h2 className="start-menu__logo">Choose Settings:</h2>
								<StartSettings />
						</div>
						<div className="start-menu">
              <h2 className="user-info__title">User Info:</h2>

							<Link to="/Stat">
								<span className="button button-settings_bordered">Statistic</span>
							</Link>
							<Link to="/Dictionaty">
								<span className="button button-settings_bordered">Dictionary</span>
							</Link>
						</div>
						<div className="start-menu">
							<ul className="mini-games">
								<li>
									<Link to="/Game1" className="button button_bordered button-game">
										Game1
									</Link>
								</li>
								<li>
									<Link to="/Game2" className="button button_bordered button-game">
										Game2
									</Link>
								</li>
								<li>
									<Link to="/Game3" className="button button_bordered button-game">
										Game3
									</Link>
								</li>
								<li>
									<Link to="/Game4" className="button button_bordered button-game">
										Game4
									</Link>
								</li>
								<li>
									<Link to="/Game5" className="button button_bordered button-game">
										Game5
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
