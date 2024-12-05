<script>
	let { data } = $props();
</script>

<h1>My Orders</h1>

{#each data.orders as order}
	<div>
		<p>Order ID: {order.id}</p>
		<p>Date: {new Date(order.date).toLocaleDateString()}</p>
		<p>Status: {order.status}</p>
		<p>Total: ${order.totalAmount}</p>
		<a href="/customer/orders/{order.id}">View Details</a>
	</div>
{/each}