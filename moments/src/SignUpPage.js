function SignUpPage() {
	return (
		<div>
			<h1>This is the sign-up page</h1>
			<form>
				<div>
					<label for="username">Username:</label>
					<input type="text" id="username" />
				</div>
				<div>
					<label for="password">Password:</label>
					<input type="password" id="password" />
				</div>
				<div>
					<label for="email">Email Address:</label>
					<input type="emai" id="emai" />
				</div>
				<input type="submit" value="Sign Up" />
			</form>
		</div>)

}

export default SignUpPage;