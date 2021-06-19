import React from "react";
import { Link } from "react-router-dom";

function VerifiedPage() {
  return (
    <div>
      <h1>Your account has been verified</h1>
      <Link to="/login">Proceed to log in</Link>
    </div>
  );
}

export default VerifiedPage;
