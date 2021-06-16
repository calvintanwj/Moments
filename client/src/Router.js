import React, { useContext } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Workspace from "./pages/Workspace";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import NavBar from "./components/NavBar";
import AuthContext from "./context/AuthContext";

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
