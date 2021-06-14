import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Workspace from "./Workspace";
import LandingPage from "./LandingPage";
import LoginPage from "./LoginPage";
import SignUpPage from "./SignUpPage";
import NavBar from "./NavBar";

function App() {
  return (
    <Router>
      <div id="App">
        <NavBar />
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/sign-up" component={SignUpPage} />
          <Route exact path="/workspace" component={Workspace} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
