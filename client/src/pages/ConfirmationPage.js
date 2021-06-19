import React from "react";
import { Link } from "react-router-dom";

function ConfirmationPage() {
  return (
    <div id="confirmation-page-container">
      <h1>Thank you for joining Moments</h1>
      <h2>A confirmation email has been sent. Please check your inbox to confirm your account.</h2>
      <Link to="/">
        <button>Go Back Home</button>
      </Link>
    </div>
  );
}

export default ConfirmationPage;
