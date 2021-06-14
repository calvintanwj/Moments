import React from "react";
import { Link } from "react-router-dom";
import logo from "./images/navbar-icon.png";

function NavBar() {
  return (
    <nav id="navbar">
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
    </nav>
  );
}

export default NavBar;
