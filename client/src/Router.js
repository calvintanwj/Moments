import React, { useContext } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Workspace from "./pages/Workspace";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ConfirmationPage from "./pages/ConfirmationPage";
import VerifiedPage from "./pages/VerifiedPage";
import ExpiredPage from "./pages/ExpiredPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ResetEmailPage from "./pages/ResetEmailPage";
import NavBar from "./components/NavBar";
import AuthContext from "./context/AuthContext";
import PasswordChangeSuccessPage from "./pages/PasswordChangeSuccessPage";

function Router() {
  const { loggedIn } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <NavBar />
      <Switch>
        <Route exact path="/" component={LandingPage} />
        {loggedIn === false && (
          <>
            <Route exact path="/login" component={LoginPage} />
            <Route exact path="/sign-up" component={SignUpPage} />
            <Route exact path="/confirmation" component={ConfirmationPage} />
            <Route exact path="/verified" component={VerifiedPage} />
            <Route exact path="/expired" component={ExpiredPage} />
            <Route
              exact
              path="/forgot-password"
              component={ForgotPasswordPage}
            />
            <Route
              exact
              path="/reset-password/:token"
              component={ResetPasswordPage}
            />
            <Route
              exact
              path="/success"
              component={PasswordChangeSuccessPage}
            />
            <Route exact path="/resetemail" component={ResetEmailPage} />
          </>
        )}
        {loggedIn === true && (
          <>
            <Route exact path="/workspace" component={Workspace} />
          </>
        )}
      </Switch>
    </BrowserRouter>
  );
}

export default Router;
