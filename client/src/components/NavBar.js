import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../images/navbar-icon.png";
import AuthContext from "../context/AuthContext";
import LogOutBtn from "./LogOutBtn";
import EditProfileBtn from "./EditProfileBtn";
import axios from "axios";
import Success from "./Success";

function NavBar() {
  const { loggedIn } = useContext(AuthContext);
  const [name, setName] = useState("Name Here");
  const [profilePic, setprofilePic] = useState("");
  const [teleCode, setTeleCode] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function renderUserProfile() {
    try {
       axios
        .get("http://localhost:5000/update/retrieveDetails/")
      // axios.get("https://momentsorbital.herokuapp.com/update/retrieveDetails")
        .then((response) => {
          const { name, profilePic, teleCode } = response.data;
          setName(name);
          setprofilePic(profilePic);
          setTeleCode(teleCode);
        });
    } catch (err) {
      console.error(err);
    }
  }
  
  useEffect(() => {
    if (loggedIn) {
        renderUserProfile();
    }
  }, [loggedIn]); // eslint-disable-line react-hooks/exhaustive-deps

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
          <Success
            id="edit-profile-success"
            successMessage={successMessage}
            setSuccessMessage={setSuccessMessage}
          />
          <div>
            <img src={logo} alt="icon" />
            <h3 id="navbar-title">Moments</h3>
          </div>
          <div id="user-nav-container">
            <h5 key={name} id="navbar-profile-name">
              Welcome back, {name}
            </h5>
            <img
              src={`http://localhost:5000/images/${profilePic}`}
              // src={`https://momentsorbital.herokuapp.com/images/${profilePic}`}
              alt="profile-pic"
            />
            <div id="settings-menu">
              <LogOutBtn setSuccessMessage={setSuccessMessage}/>
              <EditProfileBtn
                profilePic={profilePic}
                renderUserProfile={renderUserProfile}
                name={name}
                setSuccessMessage={setSuccessMessage}
                teleCode={teleCode}
              />
            </div>
          </div>
        </>
      )}
    </nav>
  );
}

export default NavBar;
