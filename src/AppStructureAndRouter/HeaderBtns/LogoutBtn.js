import React from "react";
import {BrowserRouter as Router, Link} from "react-router-dom";
export default function LogoutBtn(props){
  return(
    <div>
    <Link to="/HomePage"><button>Home Page</button></Link>
    <Link to="/"><button onClick={props.logOut}>LogOut</button></Link>
    </div>
  )
}
