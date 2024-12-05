<script>
	import { enhance } from '$app/forms';
	let { data } = $props();
</script>

<h1>Order Details #{data.order.id}</h1>

<div>
	<p>Date: {new Date(data.order.date).toLocaleDateString()}</p>
	<p>Customer: {data.order.customer.user.email}</p>
	<p>Status: {data.order.status}</p>
	<p>Total Amount: ${data.order.totalAmount}</p>
</div>

<h2>Delivery Address</h2>
<div>
	<p>{data.order.address.description}</p>
	<p>
		{data.order.address.district.name},
		{data.order.address.district.city.name},
		{data.order.address.district.city.country.name}
	</p>
</div>

<h2>Products</h2>
{#each data.orderDetails as detail}
	<div>
		<p>Product: {detail.product.name}</p>
		<p>Quantity: {detail.quantity}</p>
		<p>Amount: ${detail.amount}</p>
	</div>
{/each}

<form method="POST" use:enhance>
	<select name="status" required>
		<option value="pending" selected={data.order.status === 'pending'}>Pending</option>
		<option value="processing" selected={data.order.status === 'processing'}>Processing</option>
		<option value="shipped" selected={data.order.status === 'shipped'}>Shipped</option>
		<option value="delivered" selected={data.order.status === 'delivered'}>Delivered</option>
		<option value="cancelled" selected={data.order.status === 'cancelled'}>Cancelled</option>
	</select>
	<button type="submit">Update Status</button>
</form>