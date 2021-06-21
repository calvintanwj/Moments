import axios from "axios";
import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import Error from "../components/Error";

function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVerify, setPasswordVerify] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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
      history.push("/confirmation");
    } catch (err) {
      console.error(err);
      setErrorMessage(err.response.data.errorMessage);
      document.getElementById("signup-alert").style.display = "block";
    }
  }

  return (
    <form id="signup-page-container" onSubmit={signup}>
      <Error id="signup-alert" errorMessage={errorMessage} />
      <h1 id="signup-page-header">Sign-up</h1>
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
