import React from "react";
import { Link } from "react-router-dom";

function SignUpPage() {
  return (
    <form id="signup-page-container" action="" method="">
      <h1 id="signup-page-header">Sign-up</h1>
      <div>
        <label for="name">Name</label>
        <input type="text" name="name" required />
        <label for="email">Email</label>
        <input type="text" name="email" required />
        <label for="password">Password</label>
        <input type="password" name="password" required />
        <label for="confirm-password">Confirm Password</label>
        <input type="password" name="confirm-password" required />
        <button type="submit">Join Now</button>
      </div>
      <div id="signup-page-footer">
        <Link to="/">
          <button>Home</button>
        </Link>
      </div>
      <div></div>
    </form>
  );
}

export default SignUpPage;
