import React, {Component} from "react";

class PasswordOptions extends Component{
  render(){
    return (
      <div className='promt__text'>
        Password must contain:
        <div>
          At least 8 characters 
          {this.props.Length ? <span className="password_correct">V</span> : <span className="password_wrong">X</span>}
        </div> 
        <div>
          At least one uppercase letter   
          {this.props.UppercaseLetter ? <span className="password_correct">V</span> : <span className="password_wrong">X</span>}
        </div>
        <div>
          At least one capital letter   
          {this.props.CapitalLetter ? <span className="password_correct">V</span> : <span className="password_wrong">X</span>}
        </div>
        <div>
          At least one digit 
          {this.props.Digit ? <span className="password_correct">V</span> : <span className="password_wrong">X</span>}
        </div>
        <div>
          At least one special character: +-_@$!%*?&#.,;:[]{} 
          {this.props.SpecialCharacter ? <span className="password_correct">V</span> : <span className="password_wrong">X</span>}
        </div>
      </div>
    )
  }
}
export default PasswordOptions