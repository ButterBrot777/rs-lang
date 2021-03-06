import React from 'react';
import './normalize.css';
import './LandingPage.scss';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

export default class Landing extends React.Component {
  render() {
    return [
      <Promo key={2} />,
      <Intro key={3} />,
      <Details key={4} />,
      <About key={5} />,
      <Footer key={6} />,
    ]
  };
}

class Promo extends React.Component {
  render() {
    return (
      <div className="wrapper wrapper__promo_colored">
        <div className="promo__wrapper wrapper__inner">
          <section id="promo" className="promo">
            <div className="promo__content">
              <h3 className="title promo__title">
                Learn english with our App
              </h3>
              <p className="promo__description">
                Train a foreign language every day and you will succeed
              </p>
            </div>
              { localStorage.getItem('token') === '' ? <Link to="/Registration"><span className="button button_colored button_promo button_promo-top">GET STARTED</span></Link> : ''}
          </section>
        </div>
      </div>
    )
  }
}

class Intro extends React.Component {
  render() {
    return (
      <div className="wrapper wrapper__intro_colored">
        <div className="intro__wrapper wrapper__inner">
          <section id="intro" className="intro">
            <h2 className="title intro__title">
              improve your knowledge and vocabulary
            </h2>
            <div className="layout-2-column">
              <article className="feature">
                <div className="feature__image col-1"></div>
                <h3 className="title feature__title">
                  smart
                </h3>
                <p className="text feature__text">
                  RS-lang allows you to learn words of the exact complexity that you choose yourself.</p>
              </article>
              <article className="feature">
                <div className="feature__image col-2"></div>
                <h3 className="title feature__title">
                  dynamic
                </h3>
                <p className="text feature__text">
                  RS-lang monitors your progress, check your mistakes and on the basis of this draws up an individual training program for each user.</p>
              </article>
              <article className="feature">
                <div className="feature__image col-3"></div>
                <h3 className="title feature__title">
                  personalized
                </h3>
                <p className="text feature__text">
                  RS-lang allows you to learn exactly the words that you want to learn. Choose the type of your training based on your current language skills.</p>
              </article>
              <article className="feature">
                <div className="feature__image col-4"></div>
                <h3 className="title feature__title">
                  universal
                </h3>
                <p className="text feature__text">
                  Wherever you are, in any free minute, open RS-lang and start your training! We are available on the Web.</p>
              </article>
            </div>
          </section>
        </div>
      </div>
    )
  }
}

class Details extends React.Component {
  render() {
    return (
      <div className="wrapper wrapper__details_colored">
        <div className="details__wrapper wrapper__inner">
          <section id="details" className="details">
            <h2 className="title details__title">
              How it works
            </h2>
            <div className="layout-3-column">
              <article className="detail">
                <h3 className="title detail__title">
                  1.
                </h3>
                <div className="detail__image col-1"></div>
                <p className="text detail__text">
                  RS-lang is based on a great learning technique called <strong>spaced repetition</strong>.
              You have an option to choose the difficulty of each word: for example, if the word seems easy,
              you can press <strong>Easy</strong> button. Firstly, this word will be repeated in 3 days
              and then the interval will grow with the number of repetitions. An initial interval for words marked as <strong>Good</strong> is 2 days and 1 day if you choose <strong>Hard</strong>.
                </p>
              </article>
              <article className="detail">
                <h3 className="title detail__title">
                  2.
                </h3>
                <div className="detail__image col-2"></div>
                <p className="text detail__text">
                  Besides, you can remove words from your main training pressing <strong>Delete</strong> or <strong>Hard Words</strong> button
              – they will appear on respective pages of the Dictionary.
              If <strong>Choose Difficulty</strong> mode is off,
              correctly guessed words are considered as Good and incorrect guesses as Hard
              but we recommend to turn this mode on so that you can choose difficulty yourself.
              Please note if you make a mistake during the training or press <strong>Again</strong>, the word will appear in the end of the training.
                </p>
              </article>
              <article className="detail">
                <h3 className="title detail__title">
                  3.
                </h3>
                <div className="detail__image col-3"></div>
                <p className="text detail__text">
                  <strong>Mini games</strong> also influence your basic training updating the number of repetitions and therefore the intervals
              and sending the words you make mistakes in to the next training.
              Please keep in mind you can choose a maximum number of words and the number of new words you would like to learn per day.
              The use of a spaced repetition technique has been shown to greatly increase the rate of learning!
                </p>
              </article>
            </div>
            { localStorage.getItem('token') === '' ? <Link to="/Registration"><span className="button button_colored button_promo">GET STARTED</span></Link> : ''}
          </section>
        </div>
      </div>
    )
  }
}

class About extends React.Component {
	render() {
		return (
			<div className="wrapper wrapper__about-us_colored">
				<div className="about-us__wrapper wrapper__inner">
					<section id="about-us" className="about-us">
						<h2 className="title about-us__title">Who we are</h2>
						<div className="layout-3-column">

							<div className="employee__wrapper block-shadowed">
								<article className="employee">
									<div className="employee__content">
										<h5 className="employee__name">Yuliya Kogol</h5>
										<p className="employee__title">Top Games Developer</p>
										<a className="employee__contact" href="mailto:kogol.julia@gmail.com">
											mail me
										</a>
									</div>
									<a href="https://github.com/22-22">
										<div className="employee__photo employee-1"></div>
									</a>
								</article>
								<div className="employee__work">
									<ul>
										<li>- implements basic training functionality</li>
										<li>- tests starting knowledge of the language</li>
										<li>- game Speak It</li>
										<li>- develops spaced repetition rules</li>
									</ul>
								</div>
							</div>

							<div className="employee__wrapper block-shadowed">
								<article className="employee block-shadowed">
									<div className="employee__content">
										<h5 className="employee__name">Kirill Vorobeychik</h5>
										<p className="employee__title">Games Developer</p>
										<a className="employee__contact" href="mailto:vorob.edu@gmail.com">
											mail me
										</a>
									</div>
									<a href="https://github.com/vorobeychik">
										<div className="employee__photo employee-2"></div>
									</a>
								</article>
								<div className="employee__work">
									<ul>
										<li>- supports react app functionality</li>
										<li>- game Audio-Call</li>
										<li>- game English-Puzzle</li>
									</ul>
								</div>
							</div>

							<div className="employee__wrapper block-shadowed">
								<article className="employee block-shadowed">
									<div className="employee__content">
										<h5 className="employee__name">Ilya Shihutin</h5>
										<p className="employee__title">Games Developer</p>
										<a className="employee__contact" href="mailto:kathyr@gmail.com">
											mail me
										</a>
									</div>
									<a href="https://github.com/ilyashihutin">
										<div className="employee__photo employee-3"></div>
									</a>
								</article>
								<div className="employee__work">
									<ul>
										<li>- implements basic statistic for each game</li>
										<li>- sending statistics to the server</li>
										<li>- game Sprint</li>
									</ul>
								</div>
							</div>

							<div className="employee__wrapper block-shadowed">
								<article className="employee block-shadowed">
									<div className="employee__content">
										<h5 className="employee__name">Nastya Koval</h5>
										<p className="employee__title">Backend Developer</p>
										<a className="employee__contact" href="mailto:anasteziyam@gmail.com">
											mail me
										</a>
									</div>
									<a href="https://github.com/nastiakoval">
										<div className="employee__photo employee-4"></div>
									</a>
								</article>
								<div className="employee__work">
									<ul>
										<li>- implements backend logic of interaction with the server for mini-games.</li>
										<li>- dictionary with words classification</li>
										<li>- adds user statistic</li>
										<li>- draws chart</li>
									</ul>
								</div>
							</div>

							<div className="employee__wrapper block-shadowed">
								<article className="employee block-shadowed">
									<div className="employee__content">
										<h5 className="employee__name">Andrey Sapranovich</h5>
										<p className="employee__title">Games Developer</p>
										<a className="employee__contact" href="mailto:sapranovich.andrey@gmail.com">
											mail me
										</a>
									</div>
									<a href="https://github.com/sapranovich">
										<div className="employee__photo employee-5"></div>
									</a>
								</article>
								<div className="employee__work">
									<ul>
										<li>- implements basic app structure</li>
										<li>- authorisation and registration</li>
										<li>- handles refresh token</li>
										<li>- game Savannah</li>
									</ul>
								</div>
							</div>

						<div className="employee__wrapper block-shadowed">
							<article className="employee block-shadowed">
								<div className="employee__content">
									<h5 className="employee__name">Pavel Karenda</h5>
									<p className="employee__title">Team Lead</p>
									<a className="employee__contact" href="mailto:korendos@gmail.com">
										mail me
									</a>
								</div>
								<a href="https://github.com/butterbrot777">
									<div className="employee__photo employee-6"></div>
								</a>
							</article>
							<div className="employee__work">
								<ul>
									<li>- coordinates teamwork, leads calls, writes work logs</li>
									<li>- supports team by work with git</li>
									<li>- implements basic app design</li>
									<li>- manages trello work flow</li>
								</ul>
							</div>
						</div>
            </div>
					</section>
				</div>
			</div>
		);
	}
}

class Footer extends React.Component {
	render() {
		return (
			<div className="wrapper wrapper__footer_colored">
				<div className="footer__wrapper wrapper__inner">
					<section id="footer" className="footer">
						<div className="footer__copywriter">
							<p>© Copyright 2020</p>
              <a href="https://github.com/butterbrot777/rs-lang" target="_blank">Link to REPO</a>
						</div>
					</section>
				</div>
			</div>
		);
	}
}
