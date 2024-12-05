<script>
	import { enhance } from '$app/forms';
	let { data } = $props();
</script>

<h1>Shopping Cart</h1>

{#if data.cartItems.length === 0}
	<p>Your cart is empty</p>
	<a href="/products">Continue Shopping</a>
{:else}
	<form method="POST" use:enhance>
		{#each data.cartItems as item}
			<div>
				<h3>{item.product.name}</h3>
				<p>Price: ${item.product.unitPrice}</p>
				<p>Available Stock: {item.product.stock}</p>

				<input
					type="number"
					name="quantity_{item.product.id}"
					value={item.quantity}
					min="1"
					max={item.product.stock}
				>

				<button
					type="submit"
					formaction="?/removeItem"
					name="productId"
					value={item.product.id}
				>
					Remove
				</button>
			</div>
		{/each}

		<p>Total: ${data.total}</p>

		<div>
			<button type="submit" formaction="?/updateCart">Update Cart</button>
			<a href="/customer/checkout">Proceed to Checkout</a>
		</div>
	</form>
{/if}