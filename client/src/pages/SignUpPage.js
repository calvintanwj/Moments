import axios from "axios";
import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import AuthContext from "../context/AuthContext";

function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVerify, setPasswordVerify] = useState("");

  const { getLoggedIn } = useContext(AuthContext);
  const history = useHistory();

  async function signup(e) {
    e.preventDefault();
    try {
      const signupData = {
        name,
        email,
        password,
        passwordVerify,
      };

      await axios.post("http://localhost:5000/auth/", signupData);
      await getLoggedIn();
      history.push("/workspace")
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <form id="signup-page-container" onSubmit={signup}>
      <h1 id="signup-page-header">Sign-up</h1>
      <div>
        <label for="name">Name</label>
        <input
          type="text"
          name="name"
          required
          onChange={(e) => setName(e.target.value)}
        />
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
        <label for="confirm-password">Confirm Password</label>
        <input
          type="password"
          name="confirm-password"
          required
          onChange={(e) => setPasswordVerify(e.target.value)}
        />
        <button type="submit">Join Now</button>
      </div>
      <div id="signup-page-footer">
        <Link to="/">
          <button>Home</button>
        </Link>
      </div>
      <div></div>
    </form>
  );
}

export default SignUpPage;
