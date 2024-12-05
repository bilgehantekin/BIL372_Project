<script>
	import { enhance } from '$app/forms';
	let { data } = $props();
</script>

<h1>{data.category.name}</h1>
<p>{data.category.description}</p>

{#each data.products as product}
	<div>
		<h3>{product.name}</h3>
		<p>{product.description}</p>
		<p>Price: ${product.unitPrice}</p>
		<p>Class: {product.productClass.name}</p>
		<p>Seller: {product.seller.user.firstName} {product.seller.user.lastName}</p>
		<a href="/products/{product.id}">View Details</a>

		{#if data.userType === 'customer'}
			<form method="POST" action="?/addToCart" use:enhance>
				<input type="hidden" name="productId" value={product.id}>
				<input type="number" name="quantity" value="1" min="1" max={product.stock}>
				<button type="submit">Add to Cart</button>
			</form>
		{/if}
	</div>
{/each}