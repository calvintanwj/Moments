import React from "react";
import { Link } from "react-router-dom";

function LoginPage() {
  return (
    <form id="login-page-container" action="" method="">
      <h1 id="login-page-header">Login</h1>
      <div id="login-page-img"></div>
      <div>
        <label for="email">Email</label>
        <input type="text" name="email" required />
        <label for="password">Password</label>
        <input type="password" name="password" required />
        <label id="remember-me" for="remember">
          <input type="checkbox" name="remember" />
          Remember me
        </label>
        <button type="submit">Login</button>
      </div>
      <div id="login-page-footer">
        <Link to="/">
          <button>Home</button>
        </Link>
        <a href="/">Forgot password?</a>
      </div>
      <div></div>
    </form>
  );
}

export default LoginPage;
