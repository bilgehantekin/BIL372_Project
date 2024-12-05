<script>
	let { data } = $props();
</script>

<h1>My Products</h1>

<a href="/seller/products/new">Add New Product</a>

{#each data.products as product}
	<div>
		<h3>{product.name}</h3>
		<p>Category: {product.category.name}</p>
		<p>Class: {product.productClass.name}</p>
		<p>Price: ${product.unitPrice}</p>
		<p>Stock: {product.stock}</p>
		<p>Description: {product.description}</p>
		<a href="/seller/products/{product.id}/edit">Edit Product</a>
	</div>
{/each}