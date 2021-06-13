import React from "react";
import {
	BrowserRouter,
	Switch,
	Route,
	Link
} from "react-router-dom";

import Workspace from "./Workspace"
import LandingPage from "./LandingPage"
import LoginPage from "./LoginPage"
import SignUpPage from "./SignUpPage"


function App() {
	return (
		<BrowserRouter>
			<nav>
				<ul>
					<li><Link to="/">Homepage</Link></li>
					<li><Link to="/login">Login</Link></li>
					<li><Link to="/sign-up">Sign-Up</Link></li>
					<li><Link to="/workspace">Workspace</Link></li>
				</ul>
			</nav>


			<Switch>
				<Route exact path="/">
					<LandingPage />
				</Route>
				<Route exact path="/login">
					<LoginPage />
				</Route>
				<Route exact path="/sign-up">
					<SignUpPage />
				</Route>
				<Route exact path="/workspace">
					<Workspace />
				</Route>

			</Switch>
		</BrowserRouter>

	);
}

export default App;