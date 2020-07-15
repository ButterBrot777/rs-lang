import React, {Component} from "react";
import {BrowserRouter as Router,Link} from "react-router-dom";

import PasswordOptions from './PasswordOptions/PasswordOptions'
import LoadingWindow from '../LoadingWindow/LoadingWindow'
import {signInRequest, getSettingsUser,startSettingsUser,signUpRequest, startStatisticsUser, getStatisticsUser} from '../ServerRequest/ServerRequests'


import './SignInAndSignUp.scss'

class SignInAndSignUp extends Component {
  constructor(props){
    super(props)
    this.state={
      email:'',
      password:'',
      passwordRepeat:'',
      emailValid: false,
      passwordValid: false,
      passwordRepeatValid: false,
      formValid: false,
      loading: false,

      MinPasswordLength: false,
      MinPresenceOneUppercaseLetter: false,
      MinPresenceOneCapitalLetter: false,
      MinPresenceOneDigit: false,
      MinOneSpecialCharacter:false
    }

    this.setUserInput = this.setUserInput.bind(this);
    this.validateField = this.validateField.bind(this);
    this.formSubmitSignIn = this.formSubmitSignIn.bind(this);
    this.formSubmitSignUp = this.formSubmitSignUp.bind(this);
    this.callLoading = this.callLoading.bind(this);
    this.droppingForm = this.droppingForm.bind(this);
  }
  droppingForm(){
    this.setState({
      password:'',
      passwordValid: false,
      passwordRepeat:'',
      passwordRepeatValid: false,
      formValid: false,

      MinPasswordLength: false,
      MinPresenceOneUppercaseLetter: false,
      MinPresenceOneCapitalLetter: false,
      MinPresenceOneDigit: false,
      MinOneSpecialCharacter:false
      })
  }
// всплывающая информация по паролю
  callLoading(){
    this.setState({
      loading: !this.state.loading,
    })
  }

  setUserInput(e){
    const name = e.target.name;
    const value = e.target.value;
    this.setState({
      [name]: value},() => {this.validateField(name, value)
    })
  }
//проверка вводимых данных с условием
  validateField(fieldName, value){   
    let passwordValid = this.state.passwordValid
    let emailValid = this.state.emailValid
    let passwordRepeatValid = this.state.passwordRepeatValid;
    let MinPasswordLength = this.state.MinPasswordLength
    let MinPresenceOneUppercaseLetter = this.state.MinPresenceOneUppercaseLetter
    let MinPresenceOneCapitalLetter = this.state.MinPresenceOneCapitalLetter
    let MinPresenceOneDigit = this.state.MinPresenceOneDigit
    let MinOneSpecialCharacter = this.state.MinOneSpecialCharacter

    switch(fieldName) {
      case 'email':
        emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/);
        break;
      case 'password':
        passwordValid = value.match(/^((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[+\-_@$!%*?&#.,;:[\]{}]).{8,})$/);
        MinPasswordLength = value.match(/^(?=^.{8,}$)/);
        MinPresenceOneUppercaseLetter = value.match(/(?=.*[A-Z])/);
        MinPresenceOneCapitalLetter = value.match(/(?=.*[a-z])/);
        MinPresenceOneDigit = value.match(/(?=.*\d)/);
        MinOneSpecialCharacter = value.match(/(?=.*[+\-_@$!%*?&#.,;:[\]{}])/);
        break;
      case 'passwordRepeat':
        passwordRepeatValid = value.match(/^((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[+\-_@$!%*?&#.,;:[\]{}]).{8,})$/);
        break;
      default:
        break;
    }
    this.setState({
      emailValid: emailValid,
      passwordValid: passwordValid,
      passwordRepeatValid:passwordRepeatValid,
      MinPresenceOneUppercaseLetter: MinPresenceOneUppercaseLetter,
      MinPresenceOneCapitalLetter: MinPresenceOneCapitalLetter,
      MinPresenceOneDigit: MinPresenceOneDigit,
      MinOneSpecialCharacter:MinOneSpecialCharacter,
      MinPasswordLength: MinPasswordLength
    },this.validateForm);
  }
//проверка формы на валидность
  validateForm() {
    if(this.props.SignFlag){
      this.setState({formValid: this.state.emailValid && this.state.passwordValid && this.state.passwordRepeatValid});
    }else{
      this.setState({formValid: this.state.emailValid && this.state.passwordValid});
    }
  }
// отправка формы на аутентификацию пользователя
  async formSubmitSignIn(e){
    e.preventDefault();
    this.callLoading();
    const UserData={
      'email': this.state.email,
      'password': this.state.password
    }
    console.log( 'Данные на аутентификацию',UserData);
    signInRequest(UserData)
      // .then(ok=>getSettingsUser())
      .then(ok=> document.location.href = "/HomePage")
      .catch(err=>{
        this.callLoading();
        alert(err)
      })
    this.droppingForm();
  }
  async formSubmitSignUp(e){
    e.preventDefault();
    if(this.state.password  === this.state.passwordRepeat){
      this.callLoading();
      const UserData={
        'email': this.state.email,
        'password': this.state.password
      }
      signUpRequest(UserData)
        .then(res => signInRequest(res))
        .then(ok => startSettingsUser())
        .then(ok=> startStatisticsUser())
        .then(ok=> document.location.href = "/HomePage")
        .catch(err=>{
          this.callLoading();
          console.log(err)
        })
    }else{
      alert('повторно пароль введен не правильно')
    }
    this.droppingForm(); 
  }
  render(){
    let RepeatPassword = 
      <div className='form-group'>
        <label htmlFor='passwordRepeat'></label>
        <input id="passwordRepeat" name='passwordRepeat' type='password'
          className={!this.state.passwordRepeatValid ? this.state.passwordRepeat !== '' ? 'liquid':'' : 'solid'} value={this.state.passwordRepeat} placeholder="Password-repeat"
          onChange={(event)=>this.setUserInput(event)}>
        </input>
      </div>
  return (
    <div className="modal">
      {this.state.loading ? <LoadingWindow background={'red'}/> : ''}
      <div className="modal__container" >
      {this.props.SignFlag ? '' : <Link to='/Registration'><button className="button button_colored">Go to Sign Up</button></Link>}
       <form className='form-container' onSubmit={this.props.SignFlag ? this.formSubmitSignUp : this.formSubmitSignIn}>
       {this.props.SignFlag ? <h3> Sign Up</h3> : <h3> Sign In</h3>}
  
           <div className='form-group'>
              <label htmlFor='Email'></label>
              <input id="email" name='email' required
              className={!this.state.emailValid ? this.state.email !== '' ? 'liquid':'' : 'solid'} value={this.state.email} placeholder="Enter your Email"
              onChange={(event)=>this.setUserInput(event)}></input>
           </div>

           <div className="form-group">
              <label htmlFor="Password"></label>
              <input id="password" name="password" type="password" required
               className={!this.state.passwordValid ? this.state.password !== '' ? 'liquid': '' : 'solid'}  value={this.state.password} placeholder="Password"
               onChange={(event)=>this.setUserInput(event)}></input>
           </div>

           {this.props.SignFlag ? RepeatPassword : ''}

           <PasswordOptions  Length={this.state.MinPasswordLength} UppercaseLetter={this.state.MinPresenceOneUppercaseLetter} 
           CapitalLetter={this.state.MinPresenceOneCapitalLetter} Digit={this.state.MinPresenceOneDigit} SpecialCharacter={this.state.MinOneSpecialCharacter}/>

           <div className="form-btns">
             <button className="button button_colored" disabled={!this.state.formValid}>Submit</button>
             <Link to='/' className="button button_bordered">Close</Link>  
           </div>
       </form>
       {this.props.SignFlag ? <Link to='/Authorization' className="button button_colored">Go to Sign In</Link> : ''}
       </div>
    </div>
  )
  }
}
export default SignInAndSignUp
