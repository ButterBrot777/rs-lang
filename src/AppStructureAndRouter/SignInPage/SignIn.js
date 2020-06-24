import React, {Component} from "react";
import {BrowserRouter as Router,Link} from "react-router-dom";

import LoadingWindow from '../LoadingWindow/LoadingWindow'
import {signInRequest, getSettingsUser} from '../ServerRequest/ServerRequests'

import './ComponentSignInAndSignUp.css'

// class SignIn extends Component{
//   render(){
//     return(
//       <div className="modal">
//         <div className="modal__container">
//         <Link to='/'>zxczxczxc</Link>  
//         </div>
//       </div>
//      )
//   }
// }


// export default SingIn

class SignIn extends Component {
  constructor(props){
    super(props)
    this.state={
      email:'',
      password:'',
      emailValid: false,
      passwordValid: false,
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
// всплывающая информация по паролю
  callLoading(){
    this.setState({
      loading: !this.state.loading,
  });
  }
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
    let passwordValid = this.state.passwordValid;
    let emailValid = this.state.emailValid;

    switch(fieldName) {
      case 'email':
        emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/);
        break;
      case 'password':
        passwordValid = value.match(/^((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[+\-_@$!%*?&#.,;:[\]{}]).{8,})$/);
        break;
      default:
        break;
    }
    this.setState({
      emailValid: emailValid,
      passwordValid: passwordValid},this.validateForm);
  }
//проверка формы на валидность
  validateForm() {
    this.setState({formValid: this.state.emailValid && this.state.passwordValid});
  }
// отправка формы на аутентификацию пользователя
  async formSubmit(e){
    e.preventDefault();
    this.callLoading();
    const UserData={
      'email': this.state.email,
      'password': this.state.password
    }
    console.log( 'Данные на аутентификацию',UserData);
    signInRequest(UserData)
      .then(res=>getSettingsUser(res))
      .then(ok=> document.location.href = "/HomePage")
      .catch(err=>{
        this.callLoading();
        alert(err)})
      this.setState({
        password:'',
        passwordValid: false,
        formValid: false
      })
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
      <div className="modal__container" >
      <Link to='/Registration'><button>Go to Sign Up</button></Link>
       <form className='form-container' onSubmit={this.formSubmit}>
            <h3> Sign In</h3>
  
           <div className='form-group'>
              <label htmlFor='Email'>Email</label>
              <input id="email" name='email' 
              className={!this.state.emailValid ? this.state.email !== '' ? 'liquid':'' : 'solid'} value={this.state.email} placeholder="Enter your Email"
              onChange={(event)=>this.setUserInput(event)}></input>
           </div>

           <div className='form-group '>
              <label htmlFor='Password'>Password</label>
              <input id="password" name='password' type='password'
               className={!this.state.passwordValid ? this.state.password !== '' ? 'liquid':'' : 'solid'}  value={this.state.password} placeholder="Password"
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
       </div>
    </div>

  );
  }
}
export default SignIn