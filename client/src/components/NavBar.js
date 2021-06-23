import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../images/navbar-icon.png";
import AuthContext from "../context/AuthContext";
import LogOutBtn from "./LogOutBtn";
import EditProfileBtn from "./EditProfileBtn";
import pic1 from "../images/profilepics/default.jpg";
import pic2 from "../images/profilepics/pic1.jpg";
import pic3 from "../images/profilepics/pic2.jpg";
import pic4 from "../images/profilepics/pic3.jpg";
import pic5 from "../images/profilepics/pic4.jpg";
import axios from "axios";

function NavBar() {
  const { loggedIn } = useContext(AuthContext);
  const [name, setName] = useState("Name Here");
  const [profilePic, setprofilePic] = useState(pic1);
  const imageChoices = [
    { key: 0, name: pic1 },
    { key: 1, name: pic2 },
    { key: 2, name: pic3 },
    { key: 3, name: pic4 },
    { key: 4, name: pic5 },
  ];

  useEffect(() => {
    try {
      axios
        .get("http://localhost:5000/update/retrieveDetails/")
        .then((response) => {
          const { name, profilePicID } = response.data;
          setName(name);
          setprofilePic(imageChoices[profilePicID]);
        });
    } catch (err) {
      console.error(err);
    }
  });

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
            <h5 id="navbar-profile-name">Welcome back, {name}</h5>
            <img src={profilePic.name} alt="profile-pic" />
            <div id="settings-menu">
              <LogOutBtn />
              <EditProfileBtn images={imageChoices} />
            </div>
          </div>
        </>
      )}
    </nav>
  );
}

export default NavBar;
