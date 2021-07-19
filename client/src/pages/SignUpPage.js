import axios from "axios";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Error from "../components/Error";
import PasswordStrengthBar from "react-password-strength-bar";

function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordLength, setPasswordLength] = useState(false);
  const [containsNumbers, setContainsNumbers] = useState(false);
  const [containsUppercase, setContainsUppercase] = useState(false);
  const [containsLowercase, setContainsLowercase] = useState(false);
  const [containsSpecial, setContainsSpecial] = useState(false);
  const [showInput, setShowInput] = useState(false);

  const history = useHistory();

  async function signup(e) {
    e.preventDefault();
    try {
      const signupData = {
        name,
        email,
        password,
      };

      // await axios.post("http://localhost:5000/auth/", signupData);
      await axios.post("https://momentsorbital.herokuapp.com/auth", signupData);
      history.push("/confirmation");
    } catch (err) {
      console.error(err);
      setErrorMessage(err.response.data.errorMessage);
      document.getElementById("signup-alert").style.display = "block";
    }
  }

  function checkPasswordLength(e) {
    if (e.target.value.length > 7) {
      setPasswordLength(true);
    } else {
      setPasswordLength(false);
    }
  }

  function checkUpperCase(e) {
    if (/[A-Z]/.test(e.target.value)) {
      setContainsUppercase(true);
    } else {
      setContainsUppercase(false);
    }
  }

  function checkLowerCase(e) {
    if (/[a-z]/.test(e.target.value)) {
      setContainsLowercase(true);
    } else {
      setContainsLowercase(false);
    }
  }

  function checkNumber(e) {
    if (/\d/.test(e.target.value)) {
      setContainsNumbers(true);
    } else {
      setContainsNumbers(false);
    }
  }

  function checkSpecial(e) {
    if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(e.target.value)) {
      setContainsSpecial(true);
    } else {
      setContainsSpecial(false);
    }
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
    checkPasswordLength(e);
    checkNumber(e);
    checkUpperCase(e);
    checkLowerCase(e);
    checkSpecial(e);
  }

  function toggleMasking(e) {
    e.preventDefault();
    setShowInput(!showInput);
  }

  return (
    <form id="signup-page-container" onSubmit={signup}>
      <Error
        id="signup-alert"
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
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
        type={showInput ? "text" : "password"}
        name="password"
        required
        onChange={(e) => handlePasswordChange(e)}
      />
      <PasswordStrengthBar
        className="password-strength-bar"
        password={password}
        minLength="8"
      />
      <div id="signup-password-mask" onClick={(e) => toggleMasking(e)}>
        {showInput ? (
          <i class="fas fa-eye"></i>
        ) : (
          <i class="fas fa-eye-slash"></i>
        )}
      </div>
      <div id="signup-passwordreqs">
        <div
          className={
            passwordLength
              ? "passwordreqmet eightchar"
              : "passwordrequnmet eightchar"
          }
        >
          8 characters minimum
        </div>
        <div
          className={
            containsNumbers
              ? "passwordreqmet onenum"
              : "passwordrequnmet onenum"
          }
        >
          One number
        </div>
        <div
          className={
            containsUppercase
              ? "passwordreqmet oneupp"
              : "passwordrequnmet oneupp"
          }
        >
          One uppercase character
        </div>
        <div
          className={
            containsLowercase
              ? "passwordreqmet onelow"
              : "passwordrequnmet onelow"
          }
        >
          One lowercase character
        </div>
        <div
          className={
            containsSpecial
              ? "passwordreqmet onespec"
              : "passwordrequnmet onespec"
          }
        >
          One special character (!@#$...)
        </div>
      </div>
      <button type="submit">Join Now</button>
      <div></div>
    </form>
  );
}

export default SignUpPage;
