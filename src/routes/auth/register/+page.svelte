<script>
	import { enhance } from '$app/forms';
	let accountType = 'customer';
</script>

<form method="POST" use:enhance>
	<select name="accountType" bind:value={accountType} required>
		<option value="customer">Customer</option>
		<option value="seller">Seller</option>
	</select>

	<input name="firstName" placeholder="First Name" required>
	<input name="lastName" placeholder="Last Name" required>
	<input name="email" type="email" placeholder="Email" required>
	<input name="password" type="password" placeholder="Password" required>
	<input name="phoneNumber" type="tel" placeholder="Phone Number" required>
	<input name="age" type="number" placeholder="Age" required>

	{#if accountType === 'seller'}
		<input name="taxNumber" placeholder="Tax Number" required>
		<textarea name="description" placeholder="Seller Description" required></textarea>
	{/if}

	<button type="submit">Register</button>
</form>