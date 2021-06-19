import React from "react";
import { Link } from "react-router-dom";

function PasswordChangeSuccessPage() {
  return (
    <div id="password-success-page-container">
      <h1>You password has been successfully changed.</h1>
      <Link to="/login"><button>Proceed to log in</button></Link>
    </div>
  );
}

export default PasswordChangeSuccessPage;
