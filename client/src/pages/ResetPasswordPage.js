import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import Error from "../components/Error";

function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const history = useHistory();
  const { token } = useParams();
  const [errorMessage, setErrorMessage] = useState("");

  async function changePassword(e) {
    e.preventDefault();
    try {
      const verifyData = { newPassword, token };
      await axios.post(
        "http://localhost:5000/auth/reset-password/",
        verifyData
      );
      history.push("/success");
    } catch (err) {
      console.error(err);
      setErrorMessage(err.response.data.errorMessage);
      document.getElementById("resetpw-alert").style.display = "block";
    }
  }

  return (
    <form onSubmit={changePassword} id="reset-password-container">
      <Error id="resetpw-alert" errorMessage={errorMessage} />
      <h1>Reset your password</h1>
      <label for="password">Enter your new password</label>
      <input
        type="text"
        name="password"
        required
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <button type="submit">Change password</button>
    </form>
  );
}

export default ResetPasswordPage;
