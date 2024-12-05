<script>
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	let { data } = $props();

	let searchTerm = data.searchTerm || '';
	let selectedCategory = data.selectedCategory || '';
	let selectedProductClass = data.selectedProductClass || '';

	function handleSearch(event) {
		event.preventDefault();

		const params = new URLSearchParams();

		if (searchTerm?.trim()) {
			params.set('search', searchTerm.trim());
		}

		if (selectedCategory) {
			params.set('category', selectedCategory);
		}

		if (selectedProductClass) {
			params.set('productClass', selectedProductClass);
		}

		const queryString = params.toString();
		goto(`/products${queryString ? `?${queryString}` : ''}`);
	}
</script>

<form method="GET" on:submit={handleSearch}>
	<input
		name="search"
		placeholder="Search products"
		bind:value={searchTerm}
	>

	<select
		name="category"
		bind:value={selectedCategory}
	>
		<option value="">All Categories</option>
		{#each data.categories as category}
			<option value={category.id}>
				{category.name}
			</option>
		{/each}
	</select>

	<select
		name="productClass"
		bind:value={selectedProductClass}
	>
		<option value="">All Product Classes</option>
		{#each data.productClasses as productClass}
			<option value={productClass.id}>
				{productClass.name}
			</option>
		{/each}
	</select>

	<button type="submit">Search</button>
</form>

<section>
	{#each data.products as product}
		<div>
			<h3>{product.name}</h3>
			<p>{product.description}</p>
			<p>Price: ${product.unitPrice}</p>
			<p>Category: {product.category.name}</p>
			<p>Class: {product.productClass.name}</p>
			<p>Seller: {product.seller.user.firstName} {product.seller.user.lastName}</p>
			<a href="/products/{product.id}">View Details</a>

			{#if data.userType === 'customer'}
				<form method="POST" action="?/addToCart" use:enhance>
					<input type="hidden" name="productId" value={product.id}>
					<input
						type="number"
						name="quantity"
						value="1"
						min="1"
						max={product.stock}
					>
					<button type="submit">Add to Cart</button>
				</form>
			{/if}
		</div>
	{/each}
</section>