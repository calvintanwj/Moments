import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

function ExpiredPage() {
  const [email, setEmail] = useState("");

  const history = useHistory();

  async function resendEmail(e) {
    e.preventDefault();
    try {
      const emailData = { email };
      await axios.post("http://localhost:5000/confirmation/resend/", emailData);
      history.push("/confirmation");
    } catch (err) {
      console.error(err);
      alert(err.response.data.errorMessage);
    }
  }

  return (
    <form onSubmit={resendEmail} id="expired-page-container">
      <h1>Sorry, your confirmation link has expired.</h1>
      <h2>Please enter your email again to get a new link</h2>
      <label for="email">Email</label>
      <input
        type="email"
        name="email"
        required
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit">Resend</button>
    </form>
  );
}

export default ExpiredPage;
