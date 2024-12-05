<script>
	import { enhance } from '$app/forms';
	let { data } = $props();
	let quantity = 1;



</script>

<article>
	<h1>{data.product.name}</h1>
	<p>{data.product.description}</p>
	<p>Price: ${data.product.unitPrice}</p>
	<p>Stock: {data.product.stock}</p>
	<p>Category: {data.product.category.name}</p>
	<p>Product Class: {data.product.productClass.name}</p>
	<p>Seller: {data.product.seller.user.firstName} {data.product.seller.user.lastName}</p>

	{#if data.userType === 'customer' && data.product.stock > 0}
		<form method="POST" use:enhance>
			<input
				type="number"
				name="quantity"
				bind:value={quantity}
				min="1"
				max={data.product.stock}
			>
			<button type="submit">Add to Cart</button>
		</form>
	{/if}

	<a href="/products/category/{data.product.category.id}">
		More from {data.product.category.name}
	</a>
</article>