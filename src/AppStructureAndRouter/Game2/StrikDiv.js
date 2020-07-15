
import React, { Component } from 'react';

class StrikDiv extends Component {

    constructor(props) {
        super(props)
        this.state = {
        };
    }
    renderSwitch(strik) {
        if (strik > 12) strik = 12;
        switch (strik) {
            case 1:
                return (
                    <div className="strik-full">
                        <div className="strik-one"></div>
                        <div className="strik-gray"></div>
                        <div className="strik-gray"></div>
                    </div>
                )
            case 5:
                return (
                    <div className="strik-full">
                        <div className="strik-two"></div>
                        <div className="strik-gray"></div>
                        <div className="strik-gray"></div>
                    </div>
                )
            case 9:
                return (
                    <div className="strik-full">
                        <div className="strik-three"></div>
                        <div className="strik-gray"></div>
                        <div className="strik-gray"></div>
                    </div>
                )
            case 2:
                return (
                    <div className="strik-full">
                        <div className="strik-one"></div>
                        <div className="strik-one"></div>
                        <div className="strik-gray"></div>
                    </div>
                )
            case 6:
                return (
                    <div className="strik-full">
                        <div className="strik-two"></div>
                        <div className="strik-two"></div>
                        <div className="strik-gray"></div>
                    </div>
                )
            case 10:
                return (
                    <div className="strik-full">
                        <div className="strik-three"></div>
                        <div className="strik-three"></div>
                        <div className="strik-gray"></div>
                    </div>
                )
            case 3:
                return (
                    <div className="strik-full">
                        <div className="strik-one"></div>
                        <div className="strik-one"></div>
                        <div className="strik-one"></div>
                    </div>
                )
            case 7:
                return (
                    <div className="strik-full">
                        <div className="strik-two"></div>
                        <div className="strik-two"></div>
                        <div className="strik-two"></div>
                    </div>
                )
            case 11:
                return (
                    <div className="strik-full">
                        <div className="strik-three"></div>
                        <div className="strik-three"></div>
                        <div className="strik-three"></div>
                    </div>
                )
            case 4:
            case 8:
                return (
                    <div className="strik-full">
                        <div className="strik-gray"></div>
                        <div className="strik-gray"></div>
                        <div className="strik-gray"></div>
                    </div>
                )
            case 12:
                return (
                    <div className="strik-full">
                        <div className="strik"></div>
                        <div className="strik"></div>
                        <div className="strik"></div>
                    </div>
                )
            default:
                return (
                    <div className="strik-full">
                        <div className="strik-gray"></div>
                        <div className="strik-gray"></div>
                        <div className="strik-gray"></div>
                    </div>
                )
        }
    }
    render() {
        return (
            <div >
                {this.renderSwitch(this.props.strikdiv)}
            </div>
        )
    }
}
export default StrikDiv