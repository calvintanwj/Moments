import React from "react";
import { Link } from "react-router-dom";

function PasswordChangeSuccessPage() {
  return (
    <div>
      <h1>You password has been successfully changed.</h1>
      <Link to="/login">Proceed to log in</Link>
    </div>
  );
}

export default PasswordChangeSuccessPage;
