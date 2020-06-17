import React, {Component} from 'react';


import './LandingPage.css'

class LandingPage extends Component{
  constructor(){
    super()
    this.state={
      landingPage:true,
      singIn:false,
     
    }

  }
  render(){
    const MainLandingPage = 
    <main> 
    <section className='slider'>Slider</section>      
    <section className='about-us'>about Us</section> 
    <section className='info'>info</section>
    </main>  
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    return(
      <div className="landing-page">

      {this.state.landingPage ? MainLandingPage : ''} 

      </div> 
    )
  }
}
export default LandingPage