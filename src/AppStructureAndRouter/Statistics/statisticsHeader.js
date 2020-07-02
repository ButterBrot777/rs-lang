import React from 'react';

class StatisticsHeader extends React.Component {

    render() {
        return (
            <div className="stat-header-buttons">
                <button className={this.props.stat === "general" ? "stat-btn active" : "stat-btn"} onClick={this.props.getGeneralStat}>Общая статистика</button>
                <button className={this.props.stat === "games" ? "stat-btn active" : "stat-btn"} onClick={this.props.getGamesStat}>Статистика по играм</button>
            </div>
        )
    }

}

export default StatisticsHeader;