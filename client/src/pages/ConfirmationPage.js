import React from "react";
import { Link } from "react-router-dom";

function ConfirmationPage() {
  return (
    <div>
      <h1>Please check your email inbox for the link</h1>
      <Link to="/">
        <button>Home</button>
      </Link>
    </div>
  );
}

export default ConfirmationPage;
