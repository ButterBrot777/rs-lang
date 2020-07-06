import React from "react";
import {BrowserRouter as Router, Link} from "react-router-dom";
export default function LogoutBtn(props){
  return(
    <div>
      <Link to="/HomePage"><span className="button button_colored">Home Page</span></Link>
      <Link to="/"><span className="button button_bordered" onClick={props.logOut}>LogOut</span></Link>
    </div>
  )
}
