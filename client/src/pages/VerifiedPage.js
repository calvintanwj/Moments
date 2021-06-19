import React from "react";
import { Link } from "react-router-dom";

function VerifiedPage() {
  return (
    <div id="verified-page-container">
      <h1>Your account has been verified</h1>
      <Link to="/login">
        <button>Proceed to log in</button>
      </Link>
    </div>
  );
}

export default VerifiedPage;
