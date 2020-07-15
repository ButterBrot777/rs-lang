import React, { Component } from 'react';

class HomePage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      page: 1,
      level: 1,
    };
    this.choosePageAndLevel = this.choosePageAndLevel.bind(this);
  }
  handleInputChange = (event) => {
    const target = event.target;
    const value = target.name === 'level' ? target.value : target.value;
    const name = target.name;
    if ((target.name === 'page' && target.value <= 30)
      || (target.name === 'level' && target.value <= 6)) {
      this.setState({
        [name]: value
      })
    } else {
      alert('level 1 - 6, page 1 - 30');
    }
  }
  choosePageAndLevel() {
    this.props.chooseLevel(this.state.page, this.state.level);
  }
  render() {
    return (
      <div className="homePage-block">
        <div className="start-game-head" style={{ color: "#fbc97e" }}>Start game</div>
        <div className="label">
          <p className="label-level" style={{ color: "#fbc97e" }}>Level</p>
          <input type="text" name="level"
            value={this.state.level}
            onChange={this.handleInputChange}
            className="settings-inputs-level"></input>
          <p className="label-page" style={{ color: "#fbc97e" }}>Page</p>
          <input type="text" name="page"
            value={this.state.page}
            onChange={this.handleInputChange}
            className="settings-inputs-page"></input>
        </div>
        <div className="flex-button">
          <div className='sprint-start-btn'>
            <button onClick={this.choosePageAndLevel}>Total words</button>
          </div>
          <div className='sprint-start-btn-default'>
            <button onClick={this.props.handleLoading}>Learned words</button>
          </div>
        </div>
      </div>
    )
  }
}
export default HomePage