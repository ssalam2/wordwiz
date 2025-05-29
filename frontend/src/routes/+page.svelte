<script>
	let { username, password } = $state('');

	let isusernameValid = $derived(
		username !== '' && username.length <= 20 && /^[a-zA-Z0-9_]+$/.test(username)
	);
	let ispasswordValid = $derived(
		password !== '' && password.length <= 16 && /^[a-zA-Z0-9_!]+$/.test(password)
	);

	function handleLogin(event) {
		event.preventDefault();
		if (isusernameValid && ispasswordValid) {
			// Handle login logic here
			console.log('Logging in with:', { username, password });
		} else {
			alert('Invalid username or password format.');
		}
	}

	function handleGuest() {
		// Handle guest login logic here
		console.log('Logging in as guest');
	}

	function handleCreateAccount() {
		// Handle account creation logic here
		console.log('Redirecting to account creation');
	}

	import logo from '$lib/assets/logo.png';
</script>

<div id="body">
	<header>
		<!-- <enhanced:img src="../../static/logo.png" alt="Logo Here" /> -->
		<img src={logo} alt="Logo Here" />
	</header>
	<main>
		<form id="loginForm" method="POST" onsubmit={handleLogin}>
			<div id="username-container">
				<label for="username">Username:</label>
				<input
					type="text"
					placeholder="Enter username..."
					name="username"
					id="username"
					bind:value={username}
				/>
			</div>
			<div id="password-container">
				<label for="password">Password:</label>
				<input
					type="text"
					placeholder="Enter password..."
					name="password"
					id="password"
					bind:value={password}
				/>
			</div>
			<div id="button-container">
				<button id="login" type="submit" disabled={!isusernameValid && !ispasswordValid}
					>Login</button
				>
				<button id="guestLogin" type="button" onclick={handleGuest}>Play as guest</button>
			</div>
		</form>
	</main>
	<section>
		<button id="createAccount" type="button" onclick={handleCreateAccount}>Create Account</button>
	</section>
</div>

<style>
	@import '../../static/login-styles.css';
</style>
