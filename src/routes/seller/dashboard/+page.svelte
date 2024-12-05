<script>
	let { data } = $props();

</script>

<h1>Seller Dashboard</h1>

<section>
	<h2>Recent Orders</h2>
	{#each data.recentOrders as order}
		<div>
			<p>Order ID: {order.order.id}</p>
			<p>Date: {new Date(order.order.date).toLocaleDateString()}</p>
			<p>Product: {order.product.name}</p>
			<p>Quantity: {order.quantity}</p>
			<p>Total: ${order.amount}</p>
			<p>Status: {order.order.status}</p>
			<a href="/seller/orders/{order.order.id}">View Order</a>
		</div>
	{/each}
</section>

<section>
	<h2>Product Summary</h2>
	<p>Total Products: {data.productCount}</p>
	<p>Low Stock Items: {data.lowStockCount}</p>
	<a href="/seller/products">Manage Products</a>
</section>