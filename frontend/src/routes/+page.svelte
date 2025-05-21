<script>
	import logo from '$lib/assets/logo.png';
</script>

<div id="body">
	<header>
		<!-- <enhanced:img src="../../static/logo.png" alt="Logo Here" /> -->
		<img src={logo} alt="Logo Here" />
	</header>
	<main>
		<form id="loginForm">
			<div id="username-container">
				<label for="username">Username:</label>
				<input type="text" placeholder="Enter username..." name="username" id="username" />
			</div>
			<div id="password-container">
				<label for="password">Password:</label>
				<input type="text" placeholder="Enter password..." name="password" id="password" />
			</div>
			<div id="button-container">
				<input id="login" type="submit" value="Login" />
				<input id="guestLogin" type="submit" value="Play as guest" />
			</div>
		</form>
	</main>
	<section>
		<button id="createAccount" type="button">Create Account</button>
	</section>
</div>

<style>
	@import '../../static/login-styles.css';
</style>
