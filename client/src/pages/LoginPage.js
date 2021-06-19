import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import AuthContext from "../context/AuthContext";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { getLoggedIn } = useContext(AuthContext);
  const history = useHistory();

  async function login(e) {
    e.preventDefault();
    try {
      const loginData = {
        email,
        password,
      };
      await axios.post("http://localhost:5000/auth/login", loginData);
      await getLoggedIn();
      history.push("/workspace");
    } catch (err) {
      console.error(err);
      alert(err.response.data.errorMessage);
    }
  }

  return (
    <form id="login-page-container" onSubmit={login}>
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
        type="password"
        name="password"
        required
        onChange={(e) => setPassword(e.target.value)}
      />
      <label id="remember-me" for="remember">
        <input type="checkbox" name="remember" />
        Remember me
      </label>
      <button type="submit">Login</button>
      <div id="login-page-footer">
        <Link to="/">
          <button>Home</button>
        </Link>
        <Link to="/forgot-password">Forgot password?</Link>
      </div>
      <div></div>
    </form>
  );
}

export default LoginPage;
