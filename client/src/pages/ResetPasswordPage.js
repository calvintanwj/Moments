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
    <div>
      <h1>Reset your password</h1>
      <form onSubmit={changePassword}>
        <label for="password">Change password</label>
        <input
          type="text"
          name="password"
          required
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default ResetPasswordPage;
