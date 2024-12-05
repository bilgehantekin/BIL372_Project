<script>
	let { data } = $props();
</script>

<h1>Welcome to Our Marketplace</h1>

{#if data.featuredProducts?.length}
	<section>
		<h2>Featured Products</h2>
		{#each data.featuredProducts as product}
			<div>
				<h3>{product.name}</h3>
				<p>{product.description}</p>
				<p>Price: ${product.unitPrice}</p>
				<p>Category: {product.category.name}</p>
				<p>Seller: {product.seller.user.firstName} {product.seller.user.lastName}</p>
				<a href="/products/{product.id}">View Details</a>
			</div>
		{/each}
	</section>
{/if}

{#if data.categories?.length}
	<section>
		<h2>Shop by Category</h2>
		{#each data.categories as category}
			<div>
				<h3>{category.name}</h3>
				<p>{category.description}</p>
				<a href="/products/category/{category.id}">Browse {category.name}</a>
			</div>
		{/each}
	</section>
{/if}