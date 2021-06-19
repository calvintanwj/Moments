import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const history = useHistory();

  async function sendPasswordEmail(e) {
    e.preventDefault();
    try {
      const emailData = { email };
      await axios.post(
        "http://localhost:5000/auth/forgot-password/",
        emailData
      );
      history.push("/resetemail");
    } catch (err) {
      console.error(err);
      alert(err.response.data.errorMessage);
    }
  }

  return (
      <form onSubmit={sendPasswordEmail} id="forgot-password-container">
        <h1>Forgot your password?</h1>
        <h3>Don't worry. Happens to the best of us.</h3>
        <label for="email">Email</label>
        <input
          type="email"
          name="email"
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
  );
}

export default ForgotPasswordPage;
