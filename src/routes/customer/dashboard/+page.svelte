<script>
	let { data } = $props();
</script>

<h1>Customer Dashboard</h1>

<section>
	<h2>Recent Orders</h2>
	{#if data.recentOrders.length > 0}
		{#each data.recentOrders as order}
			<div>
				<p>Order ID: {order.id}</p>
				<p>Date: {order.date}</p>
				<p>Status: {order.status}</p>
				<p>Total: ${order.totalAmount}</p>
				<a href="/customer/orders/{order.id}">View Details</a>
			</div>
		{/each}
	{:else}
		<p>No recent orders</p>
	{/if}
</section>

<section>
	<h2>Saved Addresses</h2>
	{#if data.addresses.length > 0}
		{#each data.addresses as address}
			<div>
				<p>{address.description}</p>
				<p>{address.district.name}, {address.district.city.name}</p>
				<p>{address.district.city.country.name}</p>
			</div>
		{/each}
	{:else}
		<p>No saved addresses</p>
		<a href="/setup/address">Add Address</a>
	{/if}
</section>