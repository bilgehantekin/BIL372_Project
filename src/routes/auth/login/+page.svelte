<script>
	import { enhance } from '$app/forms';
</script>

<form method="POST" use:enhance>
	<input name="email" type="email" placeholder="Email" required>
	<input name="password" type="password" placeholder="Password" required>
	<button type="submit">Login</button>
</form>
