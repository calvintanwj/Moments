import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import AuthContext from "../context/AuthContext";

function LogOutBtn() {
  const { getLoggedIn } = useContext(AuthContext);

  const history = useHistory();

  async function logOut() {
    // await axios.get("http://localhost:5000/auth/logout");
    await axios.get("https://momentsorbital.herokuapp.com/auth/logout");
    await getLoggedIn();
    history.push("/");
  }

  return (
    <button id="log-out-btn" onClick={logOut}>
      Log Out
    </button>
  );
}

export default LogOutBtn;
