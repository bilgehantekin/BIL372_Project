<script>
	let { data } = $props();
</script>

<h1>Order Details</h1>

<div>
	<p>Order ID: {data.order.id}</p>
	<p>Date: {data.order.date}</p>
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
		<p>Price: ${detail.amount}</p>
	</div>
{/each}

<h2>Payment Information</h2>
{#each data.payments as payment}
	<div>
		<p>Amount: ${payment.amount}</p>
		<p>Date: {payment.date}</p>
		<p>Method: {payment.paymentMethod.name}</p>
	</div>
{/each}