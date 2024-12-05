import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { seedCategoriesAndProductClassesData } from '$lib/server/db/seeds/categoriesSeed.js';

export const load = async ({ locals }) => {

	await seedCategoriesAndProductClassesData();

	const featuredProducts = await db
		.select({
			id: schema.product.id,
			name: schema.product.name,
			description: schema.product.description,
			unitPrice: schema.product.unitPrice,
			category: {
				id: schema.category.id,
				name: schema.category.name
			},
			seller: {
				id: schema.seller.id,
				user: {
					firstName: schema.user.firstName,
					lastName: schema.user.lastName
				}
			}
		})
		.from(schema.product)
		.innerJoin(schema.category, eq(schema.product.categoryId, schema.category.id))
		.innerJoin(schema.seller, eq(schema.product.sellerId, schema.seller.id))
		.innerJoin(schema.user, eq(schema.seller.userId, schema.user.id))
		.limit(6);

	// Get all categories
	const categories = await db
		.select({
			id: schema.category.id,
			name: schema.category.name,
			description: schema.category.description
		})
		.from(schema.category);

	// Get user type if logged in
	let userType = null;
	if (locals.user) {
		const [customer, seller] = await Promise.all([
			db
				.select()
				.from(schema.customer)
				.where(eq(schema.customer.userId, locals.user.id))
				.limit(1),
			db
				.select()
				.from(schema.seller)
				.where(eq(schema.seller.userId, locals.user.id))
				.limit(1)
		]);

		if (customer.length) {
			userType = 'customer';
		} else if (seller.length) {
			userType = 'seller';
		}
	}

	return {
		featuredProducts,
		categories,
		user: locals.user,
		userType
	};
};
