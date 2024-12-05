<script>
	import { enhance } from '$app/forms';
	let { data } = $props();
</script>

<h1>Edit Product</h1>

<form method="POST" use:enhance>
	<div>
		<label>Product Name
			<input name="name" value={data.product.name} required>
		</label>
	</div>

	<div>
		<label>Category
			<select name="categoryId" required>
				{#each data.categories as category}
					<option
						value={category.id}
						selected={category.id === data.product.categoryId}
					>
						{category.name}
					</option>
				{/each}
			</select>
		</label>
	</div>

	<div>
		<label>Product Class
			<select name="productClassId" required>
				{#each data.productClasses as productClass}
					<option
						value={productClass.id}
						selected={productClass.id === data.product.productClassId}
					>
						{productClass.name}
					</option>
				{/each}
			</select>
		</label>
	</div>

	<div>
		<label>Unit Price
			<input
				name="unitPrice"
				type="number"
				step="0.01"
				value={data.product.unitPrice}
				required
			>
		</label>
	</div>

	<div>
		<label>Stock
			<input
				name="stock"
				type="number"
				value={data.product.stock}
				required
			>
		</label>
	</div>

	<div>
		<label>Description
			<textarea name="description" required>{data.product.description}</textarea>
		</label>
	</div>

	<button type="submit">Update Product</button>
</form>