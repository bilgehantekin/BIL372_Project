<script>
	import { enhance } from '$app/forms';
	let { data } = $props();
</script>

<h1>Add New Product</h1>

<form method="POST" use:enhance>
	<div>
		<label>Product Name
			<input name="name" required>
		</label>
	</div>

	<div>
		<label>Category
			<select name="categoryId" required>
				<option value="">Select Category</option>
				{#each data.categories as category}
					<option value={category.id}>{category.name}</option>
				{/each}
			</select>
		</label>
	</div>

	<div>
		<label>Product Class
			<select name="productClassId" required>
				<option value="">Select Class</option>
				{#each data.productClasses as productClass}
					<option value={productClass.id}>{productClass.name}</option>
				{/each}
			</select>
		</label>
	</div>

	<div>
		<label>Unit Price
			<input name="unitPrice" type="number" step="0.01" required>
		</label>
	</div>

	<div>
		<label>Stock
			<input name="stock" type="number" required>
		</label>
	</div>

	<div>
		<label>Description
			<textarea name="description" required></textarea>
		</label>
	</div>

	<button type="submit">Add Product</button>
</form>