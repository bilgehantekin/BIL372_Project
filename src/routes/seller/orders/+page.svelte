<script>
	let { data } = $props();

	function formatDate(date) {
		return new Date(date).toLocaleDateString();
	}
</script>

<h1>Orders</h1>

{#each data.orders as order}
	<div>
		<h3>Order #{order.id}</h3>
		<p>Date: {formatDate(order.date)}</p>
		<p>Customer: {order.customer.user.email}</p>
		<p>Status: {order.status}</p>
		<p>Total Amount: ${order.totalAmount}</p>
		<a href="/seller/orders/{order.id}">View Details</a>
	</div>
{/each}