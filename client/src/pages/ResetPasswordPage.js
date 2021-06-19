import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";

function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const history = useHistory();
  const { token } = useParams();
  console.log(token);

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
      alert(err.response.data.errorMessage);
    }
  }

  return (
      <form onSubmit={changePassword} id="reset-password-container">
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
