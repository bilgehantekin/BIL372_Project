<script>
	import { enhance } from '$app/forms';
	let { data } = $props();
</script>

<h1>Edit Seller Profile</h1>

<form method="POST" use:enhance>
	<div>
		<label>First Name
			<input name="firstName" value={data.user.firstName} required>
		</label>
	</div>
	<div>
		<label>Last Name
			<input name="lastName" value={data.user.lastName} required>
		</label>
	</div>
	<div>
		<label>Email
			<input name="email" type="email" value={data.user.email} required>
		</label>
	</div>
	<div>
		<label>Phone Number
			<input name="phoneNumber" value={data.user.phoneNumber} required>
		</label>
	</div>
	<div>
		<label>Tax Number
			<input name="taxNumber" value={data.seller.taxNumber} required>
		</label>
	</div>
	<div>
		<label>Business Description
			<textarea name="description" required>{data.seller.description}</textarea>
		</label>
	</div>
	<button type="submit">Update Profile</button>
</form>