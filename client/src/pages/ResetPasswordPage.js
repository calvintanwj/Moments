import React, { useState } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import axios from "axios";
import Error from "../components/Error";
import PasswordStrengthBar from "react-password-strength-bar";

function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const history = useHistory();
  const { token } = useParams();
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordLength, setPasswordLength] = useState(false);
  const [containsNumbers, setContainsNumbers] = useState(false);
  const [containsUppercase, setContainsUppercase] = useState(false);
  const [containsLowercase, setContainsLowercase] = useState(false);
  const [containsSpecial, setContainsSpecial] = useState(false);
  const [showInput, setShowInput] = useState(false);

  async function changePassword(e) {
    e.preventDefault();
    try {
      const verifyData = { newPassword, token };
      // await axios.post(
      //   "http://localhost:5000/auth/reset-password/",
      //   verifyData
      // );
      await axios.post(
        "https://momentsorbital.herokuapp.com/auth/reset-password/",
        verifyData
      );
      history.push("/success");
    } catch (err) {
      console.error(err);
      setErrorMessage(err.response.data.errorMessage);
      document.getElementById("resetpw-alert").style.display = "block";
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
    setNewPassword(e.target.value);
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
    <form onSubmit={changePassword} id="reset-password-container">
      <Error
        id="resetpw-alert"
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
      <h1>Reset your password</h1>
      <label for="password">Enter your new password</label>
      <input
        type={showInput ? "text" : "password"}
        name="password"
        required
        onChange={(e) => handlePasswordChange(e)}
      />
      <PasswordStrengthBar
        className="password-strength-bar"
        password={newPassword}
        minLength="8"
      />
      <div id="reset-password-mask" onClick={(e) => toggleMasking(e)}>
        {showInput ? (
          <i class="fas fa-eye"></i>
        ) : (
          <i class="fas fa-eye-slash"></i>
        )}
      </div>
      <div id="reset-passwordreqs">
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
      <div id="reset-password-footer">
        <Link to="/forgot-password" id="reset-forgot-password">
          <a href>Forgot Password?</a>
        </Link>
        <button type="submit">Change password</button>
      </div>
    </form>
  );
}

export default ResetPasswordPage;
