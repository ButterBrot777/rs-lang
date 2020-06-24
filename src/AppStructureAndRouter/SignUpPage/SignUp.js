import React, {Component} from "react";
import {BrowserRouter as Router,Link} from "react-router-dom";

import LoadingWindow from '../LoadingWindow/LoadingWindow'
import {signInRequest, signUpRequest, startSettingsUser, getSettingsUser} from '../ServerRequest/ServerRequests'

import './ComponentSignInAndSignUp.css'

class SignUp extends Component {
  constructor(props){
    super(props)
    this.state={
      email:'',
      password:'',
      passwordRepeat:'',

      emailValid: false,
      passwordValid: false,
      passwordRepeatValid:false,

      passwordСondition: false,
      formValid: false,
      loading: false
    }

    this.conditionPassword = this.conditionPassword.bind(this);
    this.setUserInput = this.setUserInput.bind(this);
    this.validateField = this.validateField.bind(this);
    this.formSubmit = this.formSubmit.bind(this);
    this.callLoading = this.callLoading.bind(this);
  }
  callLoading(){
    this.setState({
      loading: !this.state.loading,
  });
  }
// всплывающая информация по паролю
  conditionPassword(){
    this.setState({
      passwordСondition: !this.state.passwordСondition,
  });
  }

// отслеживание вводимых данных
  setUserInput(e){
    const name = e.target.name;
    const value = e.target.value;
    this.setState({[name]: value},() => {this.validateField(name, value)});
  }

//проверка вводимых данных с условием
  validateField(fieldName, value){   
    let emailValid = this.state.emailValid;
    let passwordValid = this.state.passwordValid;
    let passwordRepeatValid = this.state.passwordRepeatValid;

    switch(fieldName) {
      case 'email':
        emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/);
        break;
      case 'password':
        passwordValid = value.match(/^((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[+\-_@$!%*?&#.,;:[\]{}]).{8,})$/);
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
      passwordRepeatValid:passwordRepeatValid}, this.validateForm);
  }

//проверка формы на валидность
  validateForm() {
    this.setState({formValid: this.state.emailValid && this.state.passwordValid && this.state.passwordRepeatValid});
  }

// отправка формы на регистрацию пользователя
  async formSubmit(e){
    e.preventDefault();
    if(this.state.password  === this.state.passwordRepeat){
      this.callLoading();
      const UserData={
        'email': this.state.email,
        'password': this.state.password
      }
      signUpRequest(UserData)
        .then(ok => signInRequest(UserData))
        .then(res => startSettingsUser(res))
        .then(res=>getSettingsUser(res))
        .then(ok=> document.location.href = "/HomePage")
        .catch(err=>{
          this.callLoading();
          console.log(err)})
    }else{
      alert('повторно пароль введен не правильно')
    }
    this.setState({
      password:'',
      passwordValid: false,
      passwordRepeat:'',
      passwordRepeatValid: false,
      formValid: false
    })
    // console.log(this.state.password,  this.state.passwordRepeat, this.state.password  === this.state.passwordRepeat)
    
  }
  render(){

  const conditionPasswordWindow =
    <div className='promt__text'>
    Password must contain:
    <p>1.At least 8 characters</p>
    <p>2.At least one uppercase letter</p>
    <p>3.At least one capital letter</p>
    <p>4.At least one digit</p>
    <p>5.At least one special character from +-_@$!%*?&#.,;:[]{}</p>
    </div>;

  return (
    <div className="modal">
      {this.state.loading ? <LoadingWindow/> : ''}
      <div className="modal__container">
       <form className='form-container' onSubmit={this.formSubmit}>
            <h3> Sign Up</h3>
  
           <div className='form-group'>
              <label htmlFor='Email'>Email</label>
              <input id="email" name='email' 
              className={!this.state.emailValid ? this.state.email !== '' ? 'liquid':'' : 'solid'} value={this.state.email} placeholder="Enter your Email"
              onChange={(event)=>this.setUserInput(event)}></input>
           </div>

           <div className='form-group '>
              <label htmlFor='password'>Password</label>
              <input id="password" name='password' type='password'
               className={!this.state.passwordValid ? this.state.password !== '' ? 'liquid':'' : 'solid'} value={this.state.password} placeholder="Password"
               onChange={(event)=>this.setUserInput(event)}></input>
           </div>

           <div className='form-group '>
              <label htmlFor='passwordRepeat'>Password-repeat</label>
              <input id="passwordRepeat" name='passwordRepeat' type='password'
               className={!this.state.passwordRepeatValid ? this.state.passwordRepeat !== '' ? 'liquid':'' : 'solid'} value={this.state.passwordRepeat} placeholder="Password-repeat"
               onChange={(event)=>this.setUserInput(event)}></input>
           </div>

           <div className='fomm-btns'>
             <div className='promt'>
               <img  alt='logo' onMouseOver={this.conditionPassword} onMouseOut={this.conditionPassword}/>
               {this.state.passwordСondition ? conditionPasswordWindow :''}
             </div>
             <button disabled={!this.state.formValid}>Submit</button>
             <Link to='/'><button>Close</button></Link>
           </div>
       </form>
       <Link to='/Authorization'><button>Go to Sign In</button></Link>
       </div>
    </div>
  );
  }
}
export default SignUp

