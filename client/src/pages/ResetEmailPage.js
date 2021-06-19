import React from "react";
import { Link } from "react-router-dom";

function ResetEmailPage() {
  return (
    <div id="reset-email-page-container">
      <h1>An email has been sent.</h1>
      <h2>Please check your inbox to reset your password.</h2>
      <Link to="/">
        <button>Go Back Home</button>
      </Link>
    </div>
  );
}

export default ResetEmailPage;
