<script>
	import { enhance } from '$app/forms';
	let { data } = $props();
</script>

<h1>Edit Profile</h1>

<form method="POST" use:enhance>
	<input name="firstName" value={data.user.firstName} required>
	<input name="lastName" value={data.user.lastName} required>
	<input name="email" type="email" value={data.user.email} required>
	<input name="phoneNumber" type="tel" value={data.user.phoneNumber} required>
	<input name="age" type="number" value={data.user.age} required>
	<button type="submit">Update Profile</button>
</form>