import React from 'react';

class StatisticsHeader extends React.Component {

    render() {
        return (
            <div className="stat-header-buttons">
                <button className={this.props.stat === "general" ? "stat-btn active" : "stat-btn"} onClick={this.props.getGeneralStat}>General statistics</button>
                <button className={this.props.stat === "games" ? "stat-btn active" : "stat-btn"} onClick={this.props.getGamesStat}>Game Statistics</button>
            </div>
        )
    }

}

export default StatisticsHeader;