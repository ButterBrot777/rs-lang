import React from 'react';
import './normalize.css';
import './landing_page.css';

export default class Landing extends React.Component {
  render() {
    return [
      <Header key={1} />,
      <Promo key={2} />,
      <Intro key={3} />,
      <Details key={4} />,
      <About key={5} />,
      <Footer key={6} />,
    ]
  };
}

class Header extends React.Component {
  render() {
    return(
      <div className="wrapper wrapper__header_colored">
        <div className="header__wrapper wrapper__inner">
          <header id="header" className="header">
            <a href="#">
              <h1 className="logo">rs-lang-learn</h1>
            </a>
            <div className="header__buttons">
              <button className="button button_bordered">Sign In</button>
              <button className="button button_colored">Sign Up</button>
            </div>
          </header>
        </div>
      </div>
    )
  }
}

class Promo extends React.Component {
  render() {
    return(
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
              <button className="button button_colored button_promo">Get started</button>
            </div>
          </section>
        </div>
      </div>
    )
  }
}

class Intro extends React.Component {
  render() {
    return(
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
    return(
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
                  Register
                </p>
              </article>
              <article className="detail">
                <h3 className="title detail__title">
                  2.
                </h3>
                <div className="detail__image col-2"></div>
                <p className="text detail__text">
                  Start learning words
                </p>
              </article>
              <article className="detail">
                <h3 className="title detail__title">
                  3.
                </h3>
                <div className="detail__image col-3"></div>
                <p className="text detail__text">
                  Play mini games
                </p>
              </article>
            </div>
          </section>
          <button className="button button_colored button_details">Get started</button>
        </div>
      </div>
    )
  }
}

class About extends React.Component {
  render() {
    return(
      <div className="wrapper wrapper__about-us_colored">
        <div className="about-us__wrapper wrapper__inner">
          <section id="about-us" className="about-us">
            <h2 className="title about-us__title">Who we are</h2>
            <div className="layout-3-column">
              <article class="employee block-shadowed">
                <div className="employee__content">
                  <h5 className="employee__name">Yuliya Kogol</h5>
                  <p className="employee__title">Absolvent RSSchool</p>
                  <a className="employee__contact" href="mailto:kogol.julia@gmail.com">kogol.julia@gmail.com</a>
                </div>
                <a href="https://github.com/22-22"><div className="employee__photo employee-1"></div></a>
              </article>
              <article class="employee block-shadowed">
                <div className="employee__content">
                  <h5 className="employee__name">Kirill Vorobeychik</h5>
                  <p className="employee__title">Absolvent RSSchool</p>
                  <a className="employee__contact" href="mailto:vorob.edu@gmail.com">vorob.edu@gmail.com</a>
                </div>
                <a href="https://github.com/vorobeychik"><div className="employee__photo employee-2"></div></a>
              </article>
              <article class="employee block-shadowed">
                <div className="employee__content">
                  <h5 className="employee__name">Ilya Shihutin</h5>
                  <p className="employee__title">Absolvent RSSchool</p>
                  <a className="employee__contact" href="mailto:kathyr@gmail.com">kathyr@gmail.com</a>
                </div>
                <a href="https://github.com/ilyashihutin"><div className="employee__photo employee-3"></div></a>
              </article>
              <article class="employee block-shadowed">
                <div className="employee__content">
                  <h5 className="employee__name">Nastya Koval</h5>
                  <p className="employee__title">Absolvent RSSchool</p>
                  <a className="employee__contact" href="mailto:anasteziyam@gmail.com">anasteziyam@gmail.com</a>
                </div>
                <a href="https://github.com/nastiakoval"><div className="employee__photo employee-4"></div></a>
              </article>
              <article class="employee block-shadowed">
                <div className="employee__content">
                  <h5 className="employee__name">Andrey Sapranovich</h5>
                  <p className="employee__title">Absolvent RSSchool</p>
                  <a className="employee__contact" href="mailto:sapranovich.andrey@gmail.com">sapranovich.andrey@gmail.com</a>
                </div>
                <a href="https://github.com/sapranovich"><div className="employee__photo employee-5"></div></a>
              </article>
              <article class="employee block-shadowed">
                <div className="employee__content">
                  <h5 className="employee__name">Pavel Karenda</h5>
                  <p className="employee__title">Absolvent RSSchool</p>
                  <a className="employee__contact" href="mailto:korendos@gmail.com">korendos@gmail.com</a>
                </div>
                <a href="https://github.com/butterbrot777"><div className="employee__photo employee-6"></div></a>
              </article>

            </div>
          </section>
        </div>
      </div>
    )
  }
}

class Footer extends React.Component {
  render() {
    return(
      <div className="wrapper wrapper__footer_colored">
        <div className="footer__wrapper wrapper__inner">
          <section id="footer" className="footer">
            <div class="footer__copywriter">
              <p>
                © Copyright 2020
              </p>
            </div>
          </section>
        </div>
      </div>
    )
  }
}