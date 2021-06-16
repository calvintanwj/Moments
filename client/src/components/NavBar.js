import React, { useContext } from "react";
import { Link } from "react-router-dom";
import logo from "../images/navbar-icon.png";
import AuthContext from "../context/AuthContext";
import LogOutBtn from "./LogOutBtn";
import profilepic from "../images/profilepic.jpg";

function NavBar() {
  const { loggedIn } = useContext(AuthContext);
  console.log(loggedIn);

  return (
    <nav id="navbar">
      {loggedIn === false && (
        <>
          <Link className="navbar-routes" to="/">
            <img src={logo} alt="icon" />
            <h3 id="navbar-title">Moments</h3>
          </Link>
          <ul className="navbar-links">
            <Link className="navbar-routes" to="/login">
              <li id="login-bt">Login</li>
            </Link>
            <Link className="navbar-routes" to="/sign-up">
              <li id="signup-bt">Sign-Up</li>
            </Link>
          </ul>
        </>
      )}
      {loggedIn === true && (
        <>
          <div>
            <img src={logo} alt="icon" />
            <h3 id="navbar-title">Moments</h3>
          </div>
          <div id="user-nav-container">
            <img src={profilepic} alt="profile-pic" /> 
            <i id="setting-icon" class="fas fa-cog"></i>
            <LogOutBtn />
          </div>
        </>
      )}
    </nav>
  );
}

export default NavBar;
