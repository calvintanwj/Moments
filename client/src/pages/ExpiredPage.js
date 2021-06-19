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
    <div>
      <h1>Sorry, the confirmation email has expired.</h1>
      <form onSubmit={resendEmail}>
        <label for="email">Email</label>
        <input
          type="email"
          name="email"
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Resend</button>
      </form>
    </div>
  );
}

export default ExpiredPage;
