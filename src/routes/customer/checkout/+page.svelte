<script>
	import { enhance } from '$app/forms';
	let { data } = $props();

	const getSubtotal = (item) => item.product.unitPrice * item.quantity;

</script>

<h1>Checkout</h1>

<form method="POST" use:enhance>
	<h2>Select Payment Method</h2>
	<select name="paymentMethodId" required>
		{#each data.paymentMethods as method}
			<option value={method.id}>{method.name}</option>
		{/each}
	</select>

	<h2>Select Delivery Address</h2>
	<select name="addressId" required>
		{#each data.addresses as address}
			<option value={address.id}>
				{address.district.name}, {address.district.city.name},
				{address.district.city.country.name} - {address.description}
			</option>
		{/each}
	</select>

	<h2>Order Summary</h2>
	{#each data.cartItems as item}
		<div>
			<p>{item.product.name}</p>
			<p>Quantity: {item.quantity}</p>
			<p>Unit Price: ${item.product.unitPrice}</p>
			<p>Subtotal: ${getSubtotal(item)}</p>
		</div>
	{/each}

	<p>Total: ${data.total}</p>
	<button type="submit">Place Order</button>
</form>