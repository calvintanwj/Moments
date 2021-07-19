import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import Error from "../components/Error";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showInput, setShowInput] = useState(false);

  const { getLoggedIn } = useContext(AuthContext);
  const history = useHistory();

  async function login(e) {
    e.preventDefault();
    try {
      const loginData = {
        email,
        password,
      };
      // await axios.post("http://localhost:5000/auth/login", loginData);
      await axios.post(
        "https://momentsorbital.herokuapp.com/auth/login",
        loginData
      );
      await getLoggedIn();
      history.push("/workspace");
    } catch (err) {
      console.error(err);
      setErrorMessage(err.response.data.errorMessage);
      document.getElementById("login-alert").style.display = "block";
    }
  }

  function toggleMasking(e) {
    e.preventDefault();
    setShowInput(!showInput);
  }

  return (
    <form id="login-page-container" onSubmit={login}>
      <Error
        id="login-alert"
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
      <h1 id="login-page-header">Login</h1>
      <div id="login-page-img"></div>
      <label for="email">Email</label>
      <input
        type="email"
        name="email"
        required
        onChange={(e) => setEmail(e.target.value)}
      />
      <label for="password">Password</label>
      <input
        type={showInput ? "text" : "password"}
        name="password"
        required
        onChange={(e) => setPassword(e.target.value)}
      />
      <div id="login-password-mask" onClick={(e) => toggleMasking(e)}>
        {showInput ? (
          <i class="fas fa-eye"></i>
        ) : (
          <i class="fas fa-eye-slash"></i>
        )}
      </div>
      {/* <label id="remember-me" for="remember">
        <input type="checkbox" name="remember" />
        Remember me
      </label> */}
      <button type="submit">Login</button>
      <div id="login-page-footer">
        <Link to="/forgot-password">Forgot your password?</Link>
      </div>
      <div></div>
    </form>
  );
}

export default LoginPage;
