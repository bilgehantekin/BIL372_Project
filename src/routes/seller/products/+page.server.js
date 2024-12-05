import { redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';

export const load = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/auth/login');
	}

	const seller = await db
		.select()
		.from(schema.seller)
		.where(eq(schema.seller.userId, locals.user.id))
		.limit(1);

	if (!seller.length) {
		throw redirect(302, '/seller/setup');
	}

	const products = await db
		.select({
			id: schema.product.id,
			name: schema.product.name,
			description: schema.product.description,
			unitPrice: schema.product.unitPrice,
			stock: schema.product.stock,
			category: {
				id: schema.category.id,
				name: schema.category.name
			},
			productClass: {
				id: schema.productClass.id,
				name: schema.productClass.name
			}
		})
		.from(schema.product)
		.leftJoin(schema.category, eq(schema.product.categoryId, schema.category.id))
		.leftJoin(schema.productClass, eq(schema.product.productClassId, schema.productClass.id))
		.where(eq(schema.product.sellerId, seller[0].id));

	return { products };
};