import { db } from '../index.js';
import * as schema from '../schema.js';

export async function seedCategoriesAndProductClassesData() {
	const existingCategories = await db.select().from(schema.category);

	if (existingCategories.length === 0) {
		await db.insert(schema.category).values([
			{
				id: crypto.randomUUID(),
				name: 'Electronics',
				description: 'Electronic devices and accessories'
			},
			{
				id: crypto.randomUUID(),
				name: 'Clothing',
				description: 'Apparel and fashion items'
			},
			{
				id: crypto.randomUUID(),
				name: 'Books',
				description: 'Books and publications'
			},
			{
				id: crypto.randomUUID(),
				name: 'Home & Garden',
				description: 'Home improvement and garden supplies'
			}
		]);
	}

	// Check if product classes exist
	const existingProductClasses = await db.select().from(schema.productClass);

	if (existingProductClasses.length === 0) {
		// Insert basic product classes
		await db.insert(schema.productClass).values([
			{
				id: crypto.randomUUID(),
				name: 'Standard'
			},
			{
				id: crypto.randomUUID(),
				name: 'Premium'
			},
			{
				id: crypto.randomUUID(),
				name: 'Limited Edition'
			},
			{
				id: crypto.randomUUID(),
				name: 'Clearance'
			}
		]);
	}
}