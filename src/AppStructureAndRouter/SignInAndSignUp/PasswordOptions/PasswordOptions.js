import React, {Component} from "react";

class PasswordOptions extends Component{

  render(){
    return (
      <div className='promt__text'>
      Password must contain:
      <div>At least 8 characters  {this.props.Length ? 'V': 'X'}</div> 
      <div>At least one uppercase letter   {this.props.UppercaseLetter ? 'V': 'X'}</div>
      <div>At least one capital letter   {this.props.CapitalLetter ? 'V': 'X'}</div>
      <div>At least one digit   {this.props.Digit ? 'V': 'X'}</div>
      <div>At least one special character from +-_@$!%*?&#.,;:[]{} {this.props.SpecialCharacter ? 'V': 'X'}</div>
      </div>
    )
  }
}

export default PasswordOptions