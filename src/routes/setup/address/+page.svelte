<script>
	import { enhance } from '$app/forms';
	let { data } = $props();
</script>

<form method="POST" use:enhance>
	<select name="countryId" required>
		<option value="">Select Country</option>
		{#each data.countries as country}
			<option value={country.id}>{country.name}</option>
		{/each}
	</select>

	<select name="cityId" required>
		<option value="">Select City</option>
		{#each data.cities as city}
			<option value={city.id}>{city.name}</option>
		{/each}
	</select>

	<select name="districtId" required>
		<option value="">Select District</option>
		{#each data.districts as district}
			<option value={district.id}>{district.name}</option>
		{/each}
	</select>

	<textarea name="description" placeholder="Address Description" required></textarea>
	<button type="submit">Save Address</button>
</form>