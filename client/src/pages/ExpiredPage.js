import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import Error from "../components/Error";

function ExpiredPage() {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const history = useHistory();

  async function resendEmail(e) {
    e.preventDefault();
    try {
      const emailData = { email };
      // await axios.post("http://localhost:5000/confirmation/resend/", emailData);
      await axios.post(
        "https://momentsorbital.herokuapp.com/confirmation/resend/",
        emailData
      );
      history.push("/confirmation");
    } catch (err) {
      console.error(err);
      setErrorMessage(err.response.data.errorMessage);
      document.getElementById("expired-alert").style.display = "block";
    }
  }

  return (
    <form onSubmit={resendEmail} id="expired-page-container">
      <Error
        id="expired-alert"
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
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
